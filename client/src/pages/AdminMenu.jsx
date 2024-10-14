import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminBoards from "../components/admin/AdminBoards";
import AdminUsers from "../components/admin/AdminUsers";

function AdminMenu(props) {
  const { user, setError } = props;
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [roles, setRoles] = useState({});
  const [boardFormData, setBoardFormData] = useState({
    name: "",
    description: "",
  });
  const [editingBoard, setEditingBoard] = useState(null);

  const navigate = useNavigate();

  // Fetch all boards
  // GET /boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards`
        );
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  // Check if user is an admin
  // If not, display an error message
  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("You must be an admin to access this page.");
    } else {
      setError("");
    }
  }, [user, setError]);

  // Handle board form change
  const handleBoardChange = (e) => {
    const { name, value } = e.target;
    setBoardFormData({
      ...boardFormData,
      [name]: value,
    });
  };
  // Handle editing board change
  const handleEditBoardChange = (e, boardId) => {
    const { name, value } = e.target;
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, [name]: value } : board
      )
    );
  };

  // Create a board
  // POST /boards
  // Request body: { name: string, description: string }
  const createBoard = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;

    if (!name || !description) {
      setError("Name and description are required");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/boards`,
        {
          name,
          description,
        },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error creating board:", error);
      setError("Error creating board", error);
    }
  };

  // Save edited board
  const saveEditedBoard = async (boardId) => {
    const board = boards.find((board) => board.id === boardId);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/boards/${boardId}`,
        { name: board.name, description: board.description },
        { withCredentials: true }
      );
      setEditingBoard(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating board:", error);
      setError("Error updating board");
    }
  };

  // Search for a user
  // GET /users/search/:username
  const handleUserSearch = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;

    if (!username) {
      setError("Username is required");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users/search/${username}`
      );
      setUsers(response.data);
      setError("");
    } catch (error) {
      console.error("Error searching for user:", error);
      setError("Error searching for user");
    }
  };

  // Update user role in the UI
  const handleRoleChange = (userId, newRole) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: newRole,
    }));
  };

  // Updating user information
  // POST /users/:userId/update-role
  // Request body: { role: string }
  const handleSubmitUser = async (userId) => {
    const role = roles[userId];
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/${userId}/update-role`,
        { role },
        { withCredentials: true }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, role } : user))
      );
      setRoles((prevRoles) => {
        const newRoles = { ...prevRoles };
        delete newRoles[userId];
        return newRoles;
      });
      setError("User has been updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error updating user");
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/boards/${boardId}`,
        { withCredentials: true }
      );
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.id !== boardId)
      );
      setError("Board has been deleted successfully!");
    } catch (error) {
      console.error("Error deleting board:", error);
      setError("Error deleting board");
    }
  };

  // If user is an admin, display the admin menu
  return (
    <section className="admin-menu">
      {user && user.role === "admin" ? (
        <>
          <h1>Admin Menu</h1>
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
        <button onClick={() => navigate(-1)}>Go Back</button>
      )}
    </section>
  );
}

export default AdminMenu;
