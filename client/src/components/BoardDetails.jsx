import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BoardDetails = (props) => {
  const { user } = props;
  const { name } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [error, setError] = useState(null);

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`, { withCredentials: true });
      if (response.status === 204) {
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error deleting post');
    }

    window.location.reload();
  }

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/boards/${name}`);
        setBoard(response.data);
      } catch (error) {
        console.error('Error fetching board:', error);
        setError('Error fetching board');
      }
    };

    fetchBoard();
  }, [name]);

  useEffect(() => {
    if (board) {
      const fetchTrendingTags = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/trendingTags`);
          setTrendingTags(response.data);
        } catch (error) {
          console.error('Error fetching tags:', error);
          setError('Error fetching tags');
        }
      };

      fetchTrendingTags();
    }
  }, [board]);

  useEffect(() => {
    if (board) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/posts`);
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setError('Error fetching posts');
        }
      };

      fetchPosts();
    }
  }, [board]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{board.name}</h1>
      <p>{board.description}</p>
      <h2>Trending Tags</h2>
      <ul>
        {trendingTags.map(trendingTag => (
          <li key={trendingTag.id}>{trendingTag.tag.name}</li>
        ))}
      </ul>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/p/${post.id}`}>
              <h3>{post.title}</h3>
            </a>
            <p>posted by {post.user.username}</p>
            {user && user.id === post.userId && <button onClick={() => handleDelete(post.id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardDetails;