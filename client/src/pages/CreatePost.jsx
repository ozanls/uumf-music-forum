import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost(props) {
  const { user, setError } = props;
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards`,
          {
            withCredentials: true,
          }
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
      setError("Log in to create a post");
    } else {
      setError("");
    }
  }, [user, setError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value.trim();
    const boardId = event.target.board.value;
    const body = event.target.body.value.trim();
    const tags = event.target.tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    if (!title || !body) {
      setError("Title and body are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts`,
        {
          title,
          boardId,
          tags,
          body,
        },
        {
          withCredentials: true,
        }
      );
      const post = response.data;
      navigate(`/p/${post.id}`);
    } catch (error) {
      setError("Error creating post:", error);
    }
  };

  if (user) {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />

        <label htmlFor="board">Board</label>
        <select id="board" name="board">
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>

        <label htmlFor="body">Body</label>
        <textarea id="body" name="body"></textarea>

        <label htmlFor="tags">Tags (comma separated)</label>
        <input type="text" id="tags" name="tags" />

        <button type="submit">Submit</button>
      </form>
    );
  } else {
    return (
      <>
        <button onClick={() => navigate("/")}>Go Home</button>
      </>
    );
  }
}

export default CreatePost;
