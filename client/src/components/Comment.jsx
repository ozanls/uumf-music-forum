import { useState, useEffect } from 'react';
import axios from 'axios';

function Comment(props) {
    const { comment, user, setError } = props;
    const [toggleEdit, setToggleEdit] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.body);
    const [commentLiked, setCommentLiked] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [likes, setLikes] = useState(comment.likes);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
          return `${seconds} seconds ago`;
      } else if (minutes < 60) {
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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/liked`, { withCredentials: true });
        setCommentLiked(response.data.liked);
      } catch (error) {
        console.error('Error fetching like status:', error);
        setError('Error fetching like status');
      }
    };

    if (user) {
      fetchLikeStatus();
    }
  }, [user, comment]);

  const handleLike = async () => {
    try {
      if (commentLiked) {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/like`, {}, { withCredentials: true });
        setCommentLiked(false);
        setLikes((prevLikes) => prevLikes - 1);
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/like`, {}, { withCredentials: true });
        setCommentLiked(true);
        setLikes((prevLikes) => prevLikes + 1);
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
      setError('Error liking/unliking comment');
    }
  };

  const handleDelete = (commentId) => {
    setCommentToDelete(commentId);
  };

  const cancelDelete = () => {
    setCommentToDelete(null);
  };

  const confirmDelete = async (commentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/comments/${commentId}`, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Error deleting comment');
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const body = event.target.body.value.trim();

    if (!body) {
        console.error("Comment is required");
        setError('Comment is required');
        return;
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/update`, {
            body
        }, {
            withCredentials: true
        });
        setToggleEdit(false);
        console.log('Comment edited successfully:', response.data);
        window.location.reload();
    } catch (error) {
        console.error("Error editing comment:", error);
        setError('Error editing comment');
    }
  }

  return (
    <div className="comment">
      {!toggleEdit ? (
        <>
          <p>{comment.body}</p>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <textarea
            name="body"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            rows="4"
            cols="25"
          />
          <button type="button" onClick={() => setToggleEdit(false)}>Cancel</button>
          <button type="submit">Save</button>
        </form>
      )}
      <p>Posted by 
        <a href={`/u/${comment.user.username}`}>{comment.user.username}</a>
      </p>
      <p>{formatDate(comment.createdAt)} 
        {comment.createdAt !== comment.updatedAt && ` (edited ${formatDate(comment.updatedAt)})`}
      </p>
      <p>{likes}
        {likes === 1 ? ' Like' : ' Likes'}
      </p>
    
      {!toggleEdit && !commentToDelete && user && (
        <>
        {commentLiked ? (
          <button onClick={handleLike}>Unlike</button>
        ) : (
          <button onClick={handleLike}>Like</button>
        )}      
          {user.id === comment.userId && (
            <button onClick={() => setToggleEdit(true)}>Edit</button>
          )}
          {(user.id === comment.userId || user.role === 'admin') && (
            <button onClick={() => handleDelete(comment.id)} data-comment-id={comment.id}>Delete</button>
          )}
        </>
      )}
      {commentToDelete === comment.id && (
        <div id="confirm-delete">
          <p>Are you sure you want to delete this?</p>
          <button onClick={() => confirmDelete(comment.id)}>Yes</button>
          <button onClick={() => cancelDelete()}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Comment;