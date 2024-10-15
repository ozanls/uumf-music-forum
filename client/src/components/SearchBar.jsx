import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchBar() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      // Send a GET request to the server to get the boards
      // GET /boards
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

    // Get the board and query from the form
    const boardId = event.target.board.value;
    const query = event.target.query.value.trim();

    // If query is empty, return
    if (!query) {
      return;
    }

    // Navigate to the search results page
    navigate(`/search/${boardId}/${query}`);
  };

  return (
    // Search Bar Component
    <form onSubmit={handleSubmit} className="searchbar">
      {/* Select Board */}
      <select name="board" className="searchbar__dropdown">
        {boards.map((board) => (
          <option key={board.id} value={board.name}>
            /{board.name}/
          </option>
        ))}
      </select>

      {/* Query Input */}
      <input
        type="text"
        name="query"
        placeholder="Search..."
        className="searchbar__input"
      />

      {/* Submit Button */}
      <button className="searchbar__submit" type="submit">
        <i className="fa-solid fa-magnifying-glass"></i>{" "}
      </button>
    </form>
  );
}

export default SearchBar;
