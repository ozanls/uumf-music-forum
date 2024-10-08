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
  const [postCount, setPostCount] = useState(0);
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
      const fetchPostCount = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/count`
          );
          setPostCount(response.data.count);
        } catch (error) {
          console.error("Error fetching post count:", error);
          setError("Error fetching post count");
        }
      };

      fetchTrendingTags();
      fetchPosts();
      fetchPostCount();
    }
  }, [board]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <section className="board-details">
      <div className="board__header">
        <div className="board__header__left">
          <span className="board__header__subtitle">/{board.name}/</span>
          <h1 className="board__header__title">{board.description}</h1>
          <span className="board__header__subtitle">{postCount} posts</span>
        </div>
        <div className="board__header__right">
          {trendingTags.length !== 0 && (
            <>
              <h3>Trending Tags</h3>
              <ul className="tags">
                {trendingTags.map((tag) => (
                  <li key={tag.id}>
                    <Tag tag={tag.tag} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <ul className="posts">
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
    </section>
  );
};

export default BoardDetails;
