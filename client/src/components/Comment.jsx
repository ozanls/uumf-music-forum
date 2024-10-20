import { useState, useEffect } from "react";
import axios from "axios";
import Username from "./Username";
import formatDate from "../utilities/formatDate";
import LikeButton from "./buttons/LikeButton";
import UnlikeButton from "./buttons/UnlikeButton";
import DeleteButton from "./buttons/DeleteButton";

function Comment(props) {
  const { comment, user, setMessage } = props;
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.body);
  const [commentLiked, setCommentLiked] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [likes, setLikes] = useState(comment.likes);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      // Send a GET request to the server to get the like status of the comment
      // GET /comments/:commentId/liked
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/liked`,
          { withCredentials: true }
        );

        // Update the commentLiked state
        setCommentLiked(response.data.liked);

        // If there is an error fetching the like status, display an error message
      } catch (error) {
        console.error("Error fetching like status:", error);
        setMessage({ type: "error", message: "Error fetching like status" });
      }
    };

    // If user is logged in, fetch the like status
    if (user) {
      fetchLikeStatus();
    }
  }, [user, comment]);

  const handleLike = async () => {
    // Send a POST request to the server to like/unlike the comment
    // POST /comments/:commentId/like
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/like`,
        {},
        { withCredentials: true }
      );

      // Update the commentLiked state
      setCommentLiked(!commentLiked);

      // If the comment is liked/unliked, update the likes count accordingly
      commentLiked
        ? setLikes((prevLikes) => prevLikes - 1)
        : setLikes((prevLikes) => prevLikes + 1);

      // If there is an error liking/unliking the comment, display an error message
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      setMessage({ type: "error", message: "Error liking/unliking comment" });
    }
  };

  // Function to handle deleting a comment
  const handleDelete = (commentId) => {
    setCommentToDelete(commentId);
  };

  // Function to cancel deleting a comment
  const cancelDelete = () => {
    setCommentToDelete(null);
  };

  const confirmDelete = async (commentId) => {
    // Send a DELETE request to the server to delete the comment
    // DELETE /comments/:commentId
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/comments/${commentId}`,
        { withCredentials: true }
      );

      // Reload the page
      window.location.reload();

      // If there is an error deleting the comment, display an error message
    } catch (error) {
      console.error("Error deleting comment:", error);
      setMessage({ type: "error", message: "Error deleting comment" });
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // Get the comment body from the form
    const body = event.target.body.value.trim();

    // If the comment body is empty, display an error message
    if (!body) {
      console.error("Comment body is required");
      setMessage({ type: "error", message: "Comment is required" });
      return;
    }

    // Send a POST request to the server to update the comment
    // POST /comments/:commentId/update
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/comments/${comment.id}/update`,
        {
          body,
        },
        {
          withCredentials: true,
        }
      );

      // Set toggleEdit to false and reload the page
      setToggleEdit(false);
      window.location.reload();

      // If there is an error editing the comment, display an error message
    } catch (error) {
      console.error("Error editing comment:", error);
      setMessage({ type: "error", message: "Error editing comment" });
    }
  };

  return (
    <div className="comment">
      {/* Comment Left (comment body, user, actions) */}
      <div className="comment__left">
        <span>
          <Username user={comment.user} />
          {"· "}
          <time>
            {formatDate(comment.createdAt)}
            {comment.createdAt !== comment.updatedAt &&
              ` (edited ${formatDate(comment.updatedAt)})`}
          </time>
        </span>

        {/* If toggleEdit is false, display the comment body */}
        {!toggleEdit ? (
          <>
            <p>{comment.body}</p>
          </>
        ) : (
          // If toggleEdit is true, display the edit form
          <form onSubmit={handleSave} className="comment__left__form">
            <textarea
              name="body"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="button-list">
              <button className="basic-button-2" type="submit">
                Save
              </button>
              <button
                className="basic-button"
                onClick={() => setToggleEdit(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Comment Actions */}
        <div className="button-list">
          {/* If user is logged in and the comment is not being edited or deleted, display the like/unlike, edit, and delete buttons */}
          {!toggleEdit && !commentToDelete && user && (
            <>
              {commentLiked ? (
                <UnlikeButton handleAction={handleLike} text={"Unlike"} />
              ) : (
                // If the comment is not liked, show a like button.
                <LikeButton handleAction={handleLike} text={"Like"} />
              )}

              {/* If the user is the author of the comment, show an edit button. */}
              {user.id === comment.userId && (
                <button
                  className="basic-button"
                  onClick={() => setToggleEdit(true)}
                >
                  Edit
                </button>
              )}

              {/* If the user is an admin or the author of the comment, show a delete button. */}
              {(user.id === comment.userId || user.role === "admin") && (
                <DeleteButton
                  handleAction={() => handleDelete(comment.id)}
                  text="Delete"
                />
              )}
            </>
          )}

          {/* If the comment is being deleted, show a confirmation message. */}
          {commentToDelete === comment.id && (
            <>
              <span>Are you sure you want to delete this comment?</span>

              <DeleteButton
                handleAction={() => confirmDelete(comment.id)}
                text="Yes"
              />
              <button className="basic-button" onClick={() => cancelDelete()}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comment Right (like count) */}
      <div className="comment__right">
        <div className="stats">
          <span className="stat-icon">
            <i className="fa-solid fa-heart like"></i> {likes}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
