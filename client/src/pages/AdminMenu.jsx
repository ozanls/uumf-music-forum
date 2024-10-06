import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminMenu(props) {
  const { user, setError } = props;
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);

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

  useEffect(() => {
    if (!user) {
      setError("Log in to access this page");
    } else {
      setError("");
    }
  }, [user, setError]);

  const handleSubmit = async (event) => {
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

  if (user && user.role === "admin") {
    return (
      <>
        <h1>Admin Menu</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Board Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter board name (e.g. rhh)"
          />
          <label htmlFor="name">Board Description:</label>
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
              <h3>{board.name}</h3>
              <p>{board.description}</p>
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    return <button onClick={() => navigate(-1)}>Go Back</button>;
  }
}

export default AdminMenu;
