import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import formatDate from "../utilities/formatDate";
import Comment from "../components/Comment";
import Username from "../components/Username";
import BoardName from "../components/BoardName";
import Tag from "../components/Tag";
import axios from "axios";
import LikeButton from "../components/buttons/LikeButton";
import UnlikeButton from "../components/buttons/UnlikeButton";
import BasicButton from "../components/buttons/BasicButton";
import DeleteButton from "../components/buttons/DeleteButton";

function PostDetails(props) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postDeleted, setPostDeleted] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const [postSaved, setPostSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const { user, setMessage } = props;

  // Fetch post details
  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchPost = async () => {
      // Send a GET request to the server to get the post details
      // GET /posts/:postId
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${postId}`
        );

        // Update the post state and likes count
        setPost(response.data);
        setLikes(response.data.likes);

        // If there is an error fetching the post, display an error message
      } catch (error) {
        console.error("Error fetching post:", error);
        setMessage({ type: "error", message: "Post Not Found" });
      }
    };

    fetchPost();
  }, [postId]);

  // Fetch comments and tags
  useEffect(() => {
    // If post is not loaded, return
    if (!post) {
      return;
    }

    const fetchComments = async () => {
      // Send a GET request to the server to get the comments for the post
      // GET /posts/:postId/comments
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/comments`
        );

        // Update the comments state
        setComments(response.data);

        // If there is an error fetching comments, display an error message
      } catch (error) {
        console.error("Error fetching comments:", error);
        setMessage({ type: "error", message: "Error fetching comments" });
      }
    };

    const fetchTags = async () => {
      // Send a GET request to the server to get the tags for the post
      // GET /posts/:postId/tags
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/tags`
        );

        // Update the tags state
        setTags(response.data);

        // If there is an error fetching tags, display an error message
      } catch (error) {
        console.error("Error fetching tags:", error);
        setMessage({ type: "error", message: "Error fetching tags" });
      }
    };

    fetchComments();
    fetchTags();
  }, [post]);

  // Fetch like and save status
  useEffect(() => {
    if (!user || !post) {
      return;
    }

    const fetchLikeStatus = async () => {
      // Send a GET request to the server to check if the post is liked
      // GET /posts/:postId/liked
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/liked`,
          { withCredentials: true }
        );

        // Update the postLiked state
        setPostLiked(response.data.liked);

        // If the post is liked, update the likes count
      } catch (error) {
        console.error("Error fetching like status:", error);
        setMessage({ type: "error", message: "Error fetching like status" });
      }
    };

    const fetchSaveStatus = async () => {
      // Send a GET request to the server to check if the post is saved
      // GET /posts/:postId/saved
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/saved`,
          { withCredentials: true }
        );

        // Update the postSaved state
        setPostSaved(response.data.saved);

        // If the post is saved, display success message, else display error message
      } catch (error) {
        console.error("Error fetching save status:", error);
        setMessage({ type: "error", message: "Error fetching save status" });
      }
    };

    fetchLikeStatus();
    fetchSaveStatus();
  }, [user, post]);

  // Delete Post, show confirmation dialog
  const handleDelete = (postId) => {
    setPostToDelete(postId);
  };

  // Cancel Delete Post
  const cancelDelete = () => {
    setPostToDelete(null);
  };

  // Confirm Delete Post
  const confirmDelete = async () => {
    // Send a DELETE request to the server to delete the post
    // DELETE /posts/:postId
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postToDelete}`,
        { withCredentials: true }
      );
      setPostDeleted(true);
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage({ type: "error", message: "Error deleting post" });
    }
  };

  // Create Comment
  const handleSubmit = async (event) => {
    event.preventDefault();
    const commentBody = event.target.comment.value.trim();
    const comment = { body: commentBody };

    // Send a POST request to the server to create a comment
    // POST /comments/:postId
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/comments/${postId}`,
        comment,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error creating comment:", error);
      setMessage({ type: "error", message: "Error creating comment" });
    }

    window.location.reload();
  };

  // Like Post
  const handleLike = async () => {
    // Send a POST request to the server to like/unlike the post
    // POST /posts/:postId/like
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      // Update the postLiked state and the likes count
      setPostLiked(!postLiked);
      postLiked
        ? setLikes((prevLikes) => prevLikes - 1)
        : setLikes((prevLikes) => prevLikes + 1);

      // If post is liked, display success message, else display error message
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      setMessage({ type: "error", message: "Error liking/unliking post" });
    }
  };

  // Save Post
  const handleSave = async () => {
    // Send a POST request to the server to save/unsaved the post
    // POST /posts/:postId/save
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/save`,
        {},
        { withCredentials: true }
      );

      // Update the postSaved state
      setPostSaved(!postSaved);

      // If post is saved, display success message, else display error message
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      setMessage({ type: "error", message: "Error saving/unsaving post" });
    }
  };

  // Edit Post
  const handleEdit = async (event) => {
    event.preventDefault();

    // Get the updated post body and tags
    const body = event.target.body.value.trim();
    // Split the tags string into an array of tags
    const tags = event.target.tags.value
      .trim()
      .split(",")
      .map((tag) => tag.trim());

    // Send a POST request to the server to update the post
    // POST /posts/:postId/update
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/update`,
        {
          body,
          tags,
        },
        { withCredentials: true }
      );

      // If the post is updated successfully, set toggleEdit to false and reload the page
      setToggleEdit(false);
      window.location.reload();

      // If there is an error updating the post, display an error message
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage({ type: "error", message: "Error updating post" });
    }
  };

  // If post is not loaded, display loading message
  if (!post) {
    return <main className="post"></main>;
  }

  // Display post details
  return (
    <main className="post">
      {/* Post Header */}
      <section className="post__header">
        <article>
          <span>
            <BoardName board={post.board} />
            {" · "}
            <Username user={post.user} /> {" · "}
            <time>
              {formatDate(post.createdAt)}
              {post.createdAt !== post.updatedAt &&
                ` (edited ${formatDate(post.updatedAt)})`}
            </time>
          </span>
          <h1>{post.title}</h1>

          {/* If toggleEdit is false, display tags and post body */}
          {!toggleEdit ? (
            <>
              {tags.length !== 0 && (
                <ul className="tags">
                  {tags.map((tag) => (
                    <Tag key={tag.id} tag={tag.tag} />
                  ))}
                </ul>
              )}
              <p>{post.body}</p>
            </>
          ) : (
            // If toggleEdit is true, display Edit Post Form
            <>
              <form className="post__edit-form" onSubmit={handleEdit}>
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  defaultValue={tags.map((tag) => tag.tag.name).join(", ")}
                />
                <label htmlFor="body">Body</label>
                <textarea name="body" id="body" defaultValue={post.body} />
                <span className="button-list">
                  <button className="basic-button-2" type="submit">
                    Save
                  </button>
                  <button
                    className="basic-button"
                    type="button"
                    onClick={() => setToggleEdit(false)}
                  >
                    Cancel
                  </button>
                </span>
              </form>
            </>
          )}

          {/* Post Stats */}
          <div className="stats">
            <span className="stat-icon">
              <i className="fa-solid fa-comment icon"></i>
              {post.comments}
            </span>
            <span className="stat-icon">
              <i className="fa-solid fa-heart like"></i> {likes}
            </span>
          </div>

          {/* Post Actions */}
          {user && !toggleEdit && (
            <div className="button-list">
              {/* If post is liked, display UnlikeButton, else display LikeButton */}
              {postLiked ? (
                <UnlikeButton handleAction={handleLike} text=" Unlike" />
              ) : (
                <LikeButton handleAction={handleLike} text=" Like" />
              )}

              {/* If post is saved, display UnsaveButton, else display SaveButton */}
              {postSaved ? (
                <BasicButton handleAction={handleSave} text=" Unsave" />
              ) : (
                <BasicButton handleAction={handleSave} text=" Save" />
              )}

              {/* If user is post owner, display EditButton */}
              {user.id === post.userId && (
                <BasicButton
                  handleAction={() => setToggleEdit(!toggleEdit)}
                  text=" Edit"
                />
              )}

              {/* If user is post owner or admin, display DeleteButton */}
              {(user.id === post.userId || user.role === "admin") && (
                <>
                  {postToDelete !== post.id && (
                    <DeleteButton
                      handleAction={() => handleDelete(post.id)}
                      text="Delete"
                    />
                  )}

                  {/* If post is selected for deletion, display confirmation dialog */}
                  {postToDelete === post.id && (
                    <>
                      <span>Are you sure you want to delete this post?</span>
                      <button className="delete-button" onClick={confirmDelete}>
                        Yes
                      </button>

                      {/* Cancel Delete Post */}
                      <BasicButton handleAction={cancelDelete} text="Cancel" />
                    </>
                  )}

                  {/* Display message if post is deleted */}
                  {postDeleted && <p>Post deleted</p>}
                </>
              )}
            </div>
          )}
        </article>
      </section>

      {/* Comments */}
      <section className="post__comments">
        <h2>Comments</h2>

        {/* If user is logged in, display comment form, else display message */}
        {user ? (
          <form onSubmit={handleSubmit} className="post__comments__form">
            <textarea
              className="post__comments__form__textarea"
              name="comment"
              id="comment"
              placeholder="Add a comment"
              rows="4"
              cols="25"
            />
            <button className="post__comments__form__submit" type="submit">
              Submit
            </button>
          </form>
        ) : (
          <p>Sign Up or Log in to comment on this post</p>
        )}

        {/* If there are no comments, display message, else display comments */}
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <ul className="comments">
            {comments.map((comment) => (
              <li key={comment.id}>
                <Comment
                  comment={comment}
                  user={user}
                  setMessage={setMessage}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default PostDetails;
