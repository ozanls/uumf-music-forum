import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Tag from "../components/Tag";
import axios from "axios";

const BoardDetails = (props) => {
  const { user, setError } = props;
  const { name } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${name}`
        );
        setBoard(response.data);
      } catch (error) {
        console.error("Error fetching board:", error);
        setError("Error fetching board");
      }
    };

    fetchBoard();
  }, [name]);

  useEffect(() => {
    if (board) {
      const fetchTrendingTags = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/trendingTags`
          );
          setTrendingTags(response.data);
        } catch (error) {
          console.error("Error fetching tags:", error);
          setError("Error fetching tags");
        }
      };
      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/posts`
          );
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
          setError("Error fetching posts");
        }
      };

      fetchTrendingTags();
      fetchPosts();
    }
  }, [board]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{board.name}</h1>
      <p>{board.description}</p>
      {trendingTags.length !== 0 && (
        <>
          <h2>Trending Tags</h2>
          <ul className="tags-container">
            {trendingTags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </ul>
        </>
      )}
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              user={user}
              posts={posts}
              setError={setError}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardDetails;
