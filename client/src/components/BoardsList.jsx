import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import axios from "axios";

const BoardsList = (props) => {
  const { user } = props;
  const [boards, setBoards] = useState([]);

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

    fetchBoards();
  }, []);

  return (
    // Boards List Component
    <section className="boards-list">
      <ul className="boards">
        {boards.map((board) => (
          <li key={board.name}>
            <BoardCard board={board} user={user} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BoardsList;
