import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchBar() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const boardId = event.target.board.value;
    const query = event.target.query.value.trim();

    if (!query) {
      return;
    }

    try {
      navigate(`/s/${boardId}/${query}`);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="board">
        {boards.map((board) => (
          <option key={board.id} value={board.name}>
            {board.name}
          </option>
        ))}
      </select>
      <input type="text" name="query" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
