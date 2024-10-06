import { useEffect, useState } from 'react';
import Tag from './Tag';
import axios from 'axios';

function PostCard(props) {
  const { post, user, setPosts, posts, setError } = props;
  const [postToDelete, setPostToDelete] = useState(null);
  const [postDeleted, setPostDeleted] = useState(false);
  const [tags, setTags] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
  
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
    if (minutes < 1) {
      return 'a few seconds ago';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return '1 hour ago';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return '1 day ago';
    } else if (days < 30) {
      return `${days} days ago`;
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const handleDelete = (postId) => {
    setPostToDelete(postId);
  };

  const cancelDelete = () => {
    setPostToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/posts/${postToDelete}`, { withCredentials: true });
      if (response.status === 204) {
        setPosts(posts.filter(post => post.id !== postToDelete));
        setPostDeleted(true);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error deleting post');
    }

    window.location.reload();
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/tags`);
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Error fetching tags');
      }
    };
    
    fetchTags();
  }, [post.id]);

  return (
    <>
      <a href={`/p/${post.id}`}>
        <h3>{post.title}</h3>
      </a>
      <p>Posted by 
          <a href={`/u/${post.user.username}`}>{post.user.username}</a>
        </p>
        <p>{formatDate(post.createdAt)} </p>
        <p> {post.likes} 
          {post.likes === 1 ? ' like' : ' likes'}
        </p>
      {tags.length !== 0 && 
      <>
        <ul className="tags-container">
          {tags.map(tag => (
            <Tag key={tag.id} tag={tag.tag} />
          ))}
        </ul>
      </>
      }
      {(user && (user.id === post.userId || user.role === 'admin')) && (
        <>
          <button onClick={() => handleDelete(post.id)}>Delete</button>
          {postToDelete === post.id && (
            <div id="confirm-delete">
              <p>Are you sure you want to delete this post?</p>
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          )}
          {postDeleted && <p>Post deleted</p>}
        </>
      )}
    </>
  );
}

export default PostCard;