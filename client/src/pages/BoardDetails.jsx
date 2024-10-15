import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BasicButton from "../components/buttons/BasicButton";
import PostCard from "../components/PostCard";
import Tag from "../components/Tag";
import axios from "axios";

const BoardDetails = (props) => {
  const { user, setMessage } = props;
  const { boardName } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [trendingTags, setTrendingTags] = useState([]);

  useEffect(() => {
    // If boardName is not provided, return
    if (!boardName) {
      return;
    }

    // Fetch the board details
    const fetchBoard = async () => {
      // Send a GET request to the server to get the board details
      // GET /boards/:boardName
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${boardName}`
        );

        // Update the board state
        setBoard(response.data);

        // If there is an error fetching the board, display an error message
      } catch (error) {
        console.error("Error fetching board:", error);
        setMessage({ type: "error", message: "Board Not Found" });
      }
    };

    fetchBoard();
  }, [boardName]);

  useEffect(() => {
    // If board is not loaded, return
    if (!board) {
      return;
    }

    // Fetch the trending tags
    const fetchTrendingTags = async () => {
      // Send a GET request to the server to get the trending tags for the board
      // GET /boards/:boardId/trendingTags
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/trendingTags`
        );

        // Update the trending tags state
        setTrendingTags(response.data);

        // If there is an error fetching tags, display an error message
      } catch (error) {
        // If there is an error fetching tags, display an error message
        console.error("Error fetching tags:", error);
        setMessage({ type: "error", message: "Error fetching tags" });
      }
    };

    // Fetch the posts
    const fetchPosts = async () => {
      // Send a GET request to the server to get the posts for the board
      // GET /boards/:boardId/posts
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/posts`
        );

        // Update the posts state
        setPosts(response.data);

        // If there is an error fetching posts, display an error message
      } catch (error) {
        console.error("Error fetching posts:", error);
        setMessage({ type: "error", message: "Error fetching posts" });
      }
    };

    // Fetch the post count
    const fetchPostCount = async () => {
      // Send a GET request to the server to get the post count for the board
      // GET /boards/:boardId/count
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/count`
        );

        // Update the post count state
        setPostCount(response.data.count);

        // If there is an error fetching the post count, display an error message
      } catch (error) {
        console.error("Error fetching post count:", error);
        setMessage({ type: "error", message: "Error fetching post count" });
      }
    };

    // Call the fetch functions
    fetchTrendingTags();
    fetchPosts();
    fetchPostCount();
  }, [board]);

  // If board is not loaded, return an empty main element
  if (!board) {
    return <main className="board-details"></main>;
  }

  return (
    <main className="board-details">
      {/* Board Details Header */}
      <section className="board__header">
        {/* Board Details Header Left (board info)*/}
        <div className="board__header__left">
          <h2 className="board__header__subtitle">/{board.name}/</h2>
          <h1 className="board__header__title">{board.description}</h1>
          <span className="board__header__subtitle">{postCount} posts</span>
        </div>

        {/* Board Details Header Right (trending tags) */}
        <div className="board__header__right">
          {/* If there are trending tags, display them */}
          {trendingTags.length !== 0 && (
            <>
              <h3>Trending Tags</h3>
              <ul className="tags">
                {/* Display each trending tag using Tag.jsx */}
                {trendingTags.map((tag) => (
                  <li key={tag.id}>
                    <Tag tag={tag.tag} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* If there are no trending tags, display a message */}
          {trendingTags.length === 0 && (
            <>
              <h3>No trending tags...</h3>
            </>
          )}

          {/* Button to view more tags */}
          <BasicButton
            text={`More /${board.name}/ Tags`}
            handleAction={() =>
              (window.location.href = `/b/${board.name}/tags`)
            }
          />
        </div>
      </section>

      {/* Posts */}
      <section className="board__posts">
        <ul className="posts">
          {/* Display each post using PostCard.jsx */}
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard
                post={post}
                user={user}
                posts={posts}
                setMessage={setMessage}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default BoardDetails;
