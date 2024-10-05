import { useState } from 'react';
import axios from 'axios';

function Comment(props) {
    const { comment, user, setError } = props;
    const [toggleEdit, setToggleEdit] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.body);
    const [commentToDelete, setCommentToDelete] = useState(null);

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
            {comment.likes === 1 ? 
                <p>{comment.likes} Like</p> : 
                <p>{comment.likes} Likes</p>
            }
                <p>{formatDate(comment.createdAt)} 
                    {comment.createdAt !== comment.updatedAt && ` (edited ${formatDate(comment.updatedAt)})`}
                </p>            
                    {!toggleEdit && !commentToDelete && user && (
                <>
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