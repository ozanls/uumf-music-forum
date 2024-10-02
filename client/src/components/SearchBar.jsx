import { useEffect, useState } from "react";
import axios from "axios";
function SearchBar() {
  const [boards, setBoards] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`${VITE_SERVER_URL}/boards`);
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    console.log("Search results:", searchResults);
  }, [searchResults]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const board = event.target.board.value;
    const search = event.target.search.value.trim();

    if (!search) {
      console.error("Search term is required");
      return;
    }

    console.log("Searching for:", search, "in board:", board);
    try {
      const response = await axios.get(
        `${VITE_SERVER_URL}/posts/search/${board}/${search}`,
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <form className="nav__search" onSubmit={handleSearch}>
      <select id="board" name="board">
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="search"
        placeholder="Enter your search terms..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
