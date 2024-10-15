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
    <form onSubmit={handleSubmit} className="searchbar">
      <select name="board" className="searchbar__dropdown">
        {boards.map((board) => (
          <option key={board.id} value={board.name}>
            /{board.name}/
          </option>
        ))}
      </select>
      <input
        type="text"
        name="query"
        placeholder="Search..."
        className="searchbar__input"
      />
      <button className="searchbar__submit" type="submit">
        <i class="fa-solid fa-magnifying-glass"></i>{" "}
      </button>
    </form>
  );
}

export default SearchBar;
