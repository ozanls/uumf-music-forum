import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Post(props) {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`);
        setPostData(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Error fetching post');
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (postData) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}/comments`);
          setComments(response.data);
        } catch (error) {
          console.error('Error fetching comments:', error);
          setError('Error fetching comments');
        }
      };

      fetchComments();
    }
  }, [postData]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const commentBody = event.target.comment.value.trim();
    const comment = { body: commentBody };

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/comments/${postId}`, comment,
        { withCredentials: true }
      );

    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Error creating comment');
    }

    window.location.reload();
  }

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/comments/${commentId}`, { withCredentials: true });
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Error deleting comment');
    }

    window.location.reload();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date; // Difference in milliseconds
  
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  if (!postData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{postData.title}</h1>
      <p>{postData.likes} Likes</p>
      <p>Posted by {postData.user.username}</p>
      <p>{formatDate(postData.createdAt)}</p>
      <p>{postData.body}</p>

        <h2>Comments</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="comment" id="comment" placeholder="Add a comment" />
          <button type="submit">Submit</button>
        </form>
        {comments.length === 0 && <p>No comments yet</p>}
        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <p>{comment.body}</p>

              <p>Posted by {comment.user.username}</p>
              <p>{formatDate(comment.createdAt)}</p>
              {props.user && props.user.id === comment.userId && <button onClick={() => handleDelete(comment.id)}>Delete</button>}
            </li>
          ))}
        </ul>
    </div>
  );
}

export default Post;