import React, { useEffect, useState } from "react";
import BoardCard from "../components/BoardCard";
import axios from "axios";

const BoardsList = (props) => {
  const { user } = props;
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

  return (
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
