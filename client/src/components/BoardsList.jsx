import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BoardsList = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/boards`);
        setBoards(response.data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div>
      <h1>Boards</h1>
      <ul>
        {boards.map(board => (
          <li key={board.name}>
            <Link to={`/b/${board.name}`}>{board.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardsList;