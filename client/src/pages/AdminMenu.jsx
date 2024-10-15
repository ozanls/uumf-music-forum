import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminBoards from "../components/admin/AdminBoards";
import AdminUsers from "../components/admin/AdminUsers";

function AdminMenu(props) {
  const { user, setMessage } = props;
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [roles, setRoles] = useState({});
  const [boardFormData, setBoardFormData] = useState({
    name: "",
    description: "",
  });
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      // Send a GET request to the server to get the boards
      // GET /boards
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards`
        );

        // Update the boards state
        setBoards(response.data);

        // If there is an error fetching boards, display an error message
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    // Call the fetchBoards function
    fetchBoards();
  }, []);

  useEffect(() => {
    // If user is not an admin, display an error message
    if (!user || user.role !== "admin") {
      setMessage({
        type: "error",
        message: "You must be an admin to access this page.",
      });

      // Else, clear the error message
    } else {
      setMessage({ type: "", message: "" });
    }
  }, [user, setMessage]);

  // Handle board form change
  const handleBoardChange = (e) => {
    // Get the name and value from the event target
    const { name, value } = e.target;

    // Update the board form data
    setBoardFormData({
      ...boardFormData,
      [name]: value,
    });
  };
  // Handle editing board change
  const handleEditBoardChange = (e, boardId) => {
    // Get the name and value from the event target
    const { name, value } = e.target;

    // Update the board state
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, [name]: value } : board
      )
    );
  };

  // Set board to delete
  const handleBoardDelete = (boardId) => {
    setBoardToDelete(boardId);
  };

  // Cancel board delete
  const cancelBoardDelete = () => {
    setBoardToDelete(null);
  };

  // Create a board
  const createBoard = async (event) => {
    event.preventDefault();

    // Get the name and description from the board form data
    const { name, description } = boardFormData;

    // If name or description is empty, display an error message
    if (!name || !description) {
      setMessage({
        type: "error",
        message: "Name and description are required",
      });
      return;
    }

    // Send a POST request to the server to create a board
    // POST /boards
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/boards`,
        {
          name,
          description,
        },
        { withCredentials: true }
      );

      // Reload the page
      window.location.reload();

      // If there is an error creating the board, display an error message
    } catch (error) {
      console.error("Error creating board:", error);
      setMessage({ type: "error", message: "Error creating board", error });
    }
  };

  // Save edited board
  const saveEditedBoard = async (boardId) => {
    // Find the board to edit
    const board = boards.find((board) => board.id === boardId);

    // Send a POST request to the server to update the board
    // POST /boards/:boardId
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/boards/${boardId}`,
        { name: board.name, description: board.description },
        { withCredentials: true }
      );

      // Clear the editing board state
      setEditingBoard(null);

      // Display a success message
      setMessage({
        type: "success",
        message: "Board has been updated successfully!",
      });

      // If there is an error updating the board, display an error message
    } catch (error) {
      console.error("Error updating board:", error);
      setMessage({ type: "error", message: "Error updating board" });
    }
  };

  // Search for a user
  const handleUserSearch = async (event) => {
    event.preventDefault();

    // Get the username from the event target
    const username = event.target.username.value;

    // If username is empty, display an error message
    if (!username) {
      setMessage({ type: "error", message: "Username is required" });
      return;
    }

    // Send a GET request to the server to search for a user
    // GET /users/search/:username
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users/search/${username}`
      );

      // Update the users state and clear the message
      setUsers(response.data);
      setMessage({ type: "", message: "" });

      // If there is an error searching for the user, display an error message
    } catch (error) {
      console.error("Error searching for user:", error);
      setMessage({ type: "error", message: "Error searching for user" });
    }
  };

  // Update user role in the UI
  const handleRoleChange = (userId, newRole) => {
    // Update the roles state with the new role
    setRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: newRole,
    }));
  };

  // Update user role in the database
  const handleSubmitUser = async (userId) => {
    const role = roles[userId];

    // Send a POST request to the server to update the user role
    // POST /users/:userId/update-role
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/${userId}/update-role`,
        { role },
        { withCredentials: true }
      );

      // Update the user role in the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, role } : user))
      );

      // Remove the user from the roles state
      setRoles((prevRoles) => {
        const newRoles = { ...prevRoles };
        delete newRoles[userId];
        return newRoles;
      });

      // Display a success message
      setMessage({
        type: "success",
        message: "User has been updated successfully!",
      });

      // If there is an error updating the user, display an error message
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage({ type: "error", message: "Error updating user" });
    }
  };

  // Delete a board
  // DELETE /boards/:boardId
  const deleteBoard = async (boardId) => {
    // Send a DELETE request to the server to delete the board
    // DELETE /boards/:boardId
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/boards/${boardId}`,
        { withCredentials: true }
      );

      // Update the boards state
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.id !== boardId)
      );

      // Set a success message
      setMessage({
        type: "success",
        message: "Board has been deleted successfully!",
      });

      // If there is an error deleting the board, display an error message
    } catch (error) {
      console.error("Error deleting board:", error);
      setMessage({ type: "error", message: "Error deleting board" });
    }
  };

  // If user is an admin, display the admin menu
  return (
    <main className="admin-menu">
      {/* If user is an admin, display the admin menu */}
      {user && user.role === "admin" ? (
        <>
          <section className="page__header">
            <h1>Admin Menu</h1>
          </section>
          <AdminBoards
            boards={boards}
            editingBoard={editingBoard}
            handleEditBoardChange={handleEditBoardChange}
            saveEditedBoard={saveEditedBoard}
            setEditingBoard={setEditingBoard}
            deleteBoard={deleteBoard}
            createBoard={createBoard}
            boardFormData={boardFormData}
            handleBoardChange={handleBoardChange}
            boardToDelete={boardToDelete}
            handleBoardDelete={handleBoardDelete}
            cancelBoardDelete={cancelBoardDelete}
          />
          <AdminUsers
            users={users}
            handleUserSearch={handleUserSearch}
            roles={roles}
            handleRoleChange={handleRoleChange}
            handleSubmitUser={handleSubmitUser}
          />
        </>
      ) : (
        // If user is not an admin, display a go back button
        <section className="page__content">
          <button className="basic-button-2" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </section>
      )}
    </main>
  );
}

export default AdminMenu;
