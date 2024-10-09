import { useState, useEffect } from "react";
import axios from "axios";
import Username from "./Username";
import formatDate from "../utilities/formatDate";
import LikeButton from "./buttons/LikeButton";
import BasicButton from "./buttons/BasicButton";
import UnlikeButton from "./buttons/UnlikeButton";
import DeleteButton from "./buttons/DeleteButton";

function Comment(props) {
  const { comment, user, setError } = props;
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.body);
  const [commentLiked, setCommentLiked] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [likes, setLikes] = useState(comment.likes);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/liked`,
          { withCredentials: true }
        );
        setCommentLiked(response.data.liked);
      } catch (error) {
        console.error("Error fetching like status:", error);
        setError("Error fetching like status");
      }
    };

    if (user) {
      fetchLikeStatus();
    }
  }, [user, comment]);

  const handleLike = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/like`,
        {},
        { withCredentials: true }
      );
      setCommentLiked(!commentLiked);
      commentLiked
        ? setLikes((prevLikes) => prevLikes - 1)
        : setLikes((prevLikes) => prevLikes + 1);
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      setError("Error liking/unliking comment");
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
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/comments/${commentId}`,
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Error deleting comment");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const body = event.target.body.value.trim();

    if (!body) {
      console.error("Comment is required");
      setError("Comment is required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/update`,
        {
          body,
        },
        {
          withCredentials: true,
        }
      );
      setToggleEdit(false);
      console.log("Comment edited successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Error editing comment");
    }
  };

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
          <button type="button" onClick={() => setToggleEdit(false)}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </form>
      )}
      <span>
        Posted by
        <Username user={comment.user} />
      </span>
      <time>
        {formatDate(comment.createdAt)}
        {comment.createdAt !== comment.updatedAt &&
          ` (edited ${formatDate(comment.updatedAt)})`}
      </time>

      <div className="comment__actions">
        {!toggleEdit && !commentToDelete && user && (
          <>
            {commentLiked ? (
              <UnlikeButton handleAction={handleLike} text={likes} />
            ) : (
              <LikeButton handleAction={handleLike} text={likes} />
            )}

            {user.id === comment.userId && (
              <BasicButton
                handleAction={() => setToggleEdit(true)}
                text="Edit"
              />
            )}
            {(user.id === comment.userId || user.role === "admin") && (
              <DeleteButton
                handleAction={() => handleDelete(comment.id)}
                text="Delete"
              />
            )}
          </>
        )}

        {commentToDelete === comment.id && (
          <>
            <span>Are you sure you want to delete this comment?</span>

            <DeleteButton
              handleAction={() => confirmDelete(comment.id)}
              text="Yes"
            />
            <BasicButton handleAction={() => cancelDelete()} text="Cancel" />
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
