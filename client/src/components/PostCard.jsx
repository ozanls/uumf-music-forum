import { useEffect, useState } from 'react';
import formatDate from "../utilities/formatDate";
import Tag from './Tag';
import axios from 'axios';

function PostCard(props) {
  const { post, user, setPosts, posts, setError } = props;
  const [postToDelete, setPostToDelete] = useState(null);
  const [postDeleted, setPostDeleted] = useState(false);
  const [tags, setTags] = useState([]);

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