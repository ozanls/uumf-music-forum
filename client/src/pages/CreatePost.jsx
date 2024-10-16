import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../utilities/usePageTitle";
import ReCAPTCHA from "react-google-recaptcha";

function CreatePost(props) {
  const { user, setMessage } = props;
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const [recaptcha, setRecaptcha] = useState(null);

  // Set the page title
  usePageTitle("Create a Post");

  useEffect(() => {
    const fetchBoards = async () => {
      // Send a GET request to the server to get the boards
      // GET /boards
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards`,
          {
            withCredentials: true,
          }
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

  useEffect(() => {
    // If user is not logged in, display an error message
    if (!user) {
      setMessage({ type: "error", message: "Log in to create a post" });

      // Else, clear the error message
    } else {
      setMessage({ type: "", message: "" });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the title, board, body, and tags from the form
    const title = event.target.title.value.trim();
    const boardId = event.target.board.value;
    const body = event.target.body.value.trim();

    // Split the tags by comma, trim whitespace, and remove empty strings
    const tags = event.target.tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // If title or body is empty, display an error message
    if (!title || !body) {
      setMessage({ type: "error", message: "Title and body are required" });
      return;
    }

    // Send a POST request to the server to create a post
    // POST /posts
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

      // If the post is created successfully, navigate to the post
      const post = response.data;
      setMessage({ type: "", message: "" });
      navigate(`/post/${post.id}`);

      // If there is an error creating the post, display an error message
    } catch (error) {
      setMessage({
        type: "error",
        message: `Error creating post: ${error.message}`,
      });
    }
  };

  return (
    <main>
      {/* If user is logged in, display the create post form */}
      {user ? (
        <>
          {/* Create Post Header */}
          <section className="page__header">
            <h1>Create a Post</h1>
            <span>
              All posts must comply with our{" "}
              <a href="/rules">
                <u>site rules</u>
              </a>
            </span>
          </section>

          {/* Create Post Form */}
          <section className="page__content">
            <form onSubmit={handleSubmit} className="create-post-form">
              <label htmlFor="board">Board</label>
              <select
                id="board"
                className="create-post-form__select"
                name="board"
              >
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>

              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" />

              <label htmlFor="body">Body</label>
              <textarea id="body" name="body"></textarea>

              <label htmlFor="tags">Tags (comma separated)</label>
              <input type="text" id="tags" name="tags" />

              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(i) => setRecaptcha(i)}
              />
              <button
                disabled={!recaptcha}
                className="basic-button-2"
                type="submit"
              >
                Submit
              </button>
            </form>
          </section>
        </>
      ) : (
        // If user is not logged in, render a button to go back, alongside the previously set error message
        <button onClick={() => navigate(-1)}>Go Back</button>
      )}
    </main>
  );
}

export default CreatePost;
