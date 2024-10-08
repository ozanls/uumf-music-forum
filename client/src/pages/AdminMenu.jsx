import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BoardCard from "../components/BoardCard";

function AdminMenu(props) {
  const { user, setError } = props;
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [roles, setRoles] = useState({});
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
    if (!user || !user.role === "admin") {
      setError("You must be an admin to access this page.");
    } else {
      setError("");
    }
  }, [user, setError]);

  // Create a board
  // POST /boards
  // Request body: { name: string, description: string }
  const handleSubmitBoard = async (event) => {
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
      setError("");
      navigate(`/b/${name}`);
    } catch (error) {
      console.error("Error creating board:", error);
      setError("Error creating board", error);
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

  // If user is an admin, display the admin menu
  return (
    <section className="admin-menu">
      {user && user.role === "admin" ? (
        <>
          <h1>Admin Menu</h1>
          <h2>Create a board</h2>
          <form onSubmit={handleSubmitBoard}>
            <label htmlFor="name">Board Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter board name (e.g. rhh)"
            />
            <label htmlFor="description">Board Description:</label>
            <input
              type="textarea"
              name="description"
              id="description"
              placeholder="Enter board description (e.g. Rap & Hip-Hop)"
            />
            <button type="submit">Create Board</button>
          </form>

          <h2>Boards</h2>
          <ul>
            {boards.map((board) => (
              <li key={board.name}>
                <BoardCard board={board} />
              </li>
            ))}
          </ul>

          <h2>Search for a user</h2>
          <form onSubmit={handleUserSearch}>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
            />
            <button type="submit">Search</button>
          </form>
          {users.length === 0 && <p>No users found</p>}
          {users.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Confirmed Email</th>
                    <th>Receive Promo</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={roles[user.id] || user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="vip">VIP</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td>{user.confirmedEmail ? "Yes" : "No"}</td>
                      <td>{user.receivePromo ? "Yes" : "No"}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleSubmitUser(user.id)}>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      ) : (
        // If not an admin, display a return button
        <button onClick={() => navigate(-1)}>Go Back</button>
      )}
    </section>
  );
}

export default AdminMenu;
