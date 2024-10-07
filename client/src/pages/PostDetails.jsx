import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import formatDate from "../utilities/formatDate";
import Comment from "../components/Comment";
import Tag from "../components/Tag";
import axios from "axios";

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
  const { user, setError } = props;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${postId}`
        );
        setPost(response.data);
        setLikes(response.data.likes);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error fetching post");
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Error fetching comments");
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/tags`
        );
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError("Error fetching tags");
      }
    };

    fetchComments();
    fetchTags();
  }, [postId]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/liked`,
          { withCredentials: true }
        );
        setPostLiked(response.data.liked);
      } catch (error) {
        console.error("Error fetching like status:", error);
        setError("Error fetching like status");
      }
    };
    const fetchSaveStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/saved`,
          { withCredentials: true }
        );
        setPostSaved(response.data.saved);
      } catch (error) {
        console.error("Error fetching save status:", error);
        setError("Error fetching save status");
      }
    };

    if (user) {
      fetchLikeStatus();
      fetchSaveStatus();
    }
  }, [user, postId]);

  const handleDelete = (postId) => {
    setPostToDelete(postId);
  };

  const cancelDelete = () => {
    setPostToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postToDelete}`,
        { withCredentials: true }
      );
      setPostDeleted(true);
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Error deleting post");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const commentBody = event.target.comment.value.trim();
    const comment = { body: commentBody };

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/comments/${postId}`,
        comment,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Error creating comment");
    }

    window.location.reload();
  };

  const handleLike = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setPostLiked(!postLiked);
      postLiked
        ? setLikes((prevLikes) => prevLikes - 1)
        : setLikes((prevLikes) => prevLikes + 1);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      setError("Error liking/unliking post");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/save`,
        {},
        { withCredentials: true }
      );
      setPostSaved(!postSaved);
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      setError("Error saving/unsaving post");
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const body = event.target.body.value.trim();
    const tags = event.target.tags.value
      .trim()
      .split(",")
      .map((tag) => tag.trim());
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postId}/update`,
        {
          body,
          tags,
        },
        { withCredentials: true }
      );
      setToggleEdit(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Error updating post");
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        Posted by
        <a href={`/u/${post.user.username}`}>{post.user.username}</a>
      </p>
      <h1>{post.title}</h1>
      {!toggleEdit ? (
        <>
          <p>{post.body}</p>
        </>
      ) : (
        <>
          <form onSubmit={handleEdit}>
            <textarea name="body" id="body" defaultValue={post.body} />
            <label htmlFor="tags">Tags:</label>
            <input
              type="text"
              name="tags"
              id="tags"
              defaultValue={tags.map((tag) => tag.tag.name).join(", ")}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setToggleEdit(false)}>
              Cancel
            </button>
          </form>
        </>
      )}
      {!toggleEdit && tags.length !== 0 && (
        <ul className="tags-container">
          {tags.map((tag) => (
            <Tag key={tag.id} tag={tag.tag} />
          ))}
        </ul>
      )}
      <p>
        {formatDate(post.createdAt)}
        {post.createdAt !== post.updatedAt &&
          ` (edited ${formatDate(post.updatedAt)})`}
      </p>

      <p>
        {likes}
        {likes === 1 ? " like" : " likes"}
      </p>

      <p>
        {post.comments}
        {post.comments === 1 ? " comment" : " comments"}
      </p>

      {user &&
        postToDelete === null &&
        (postLiked ? (
          <button onClick={handleLike}>Unlike</button>
        ) : (
          <button onClick={handleLike}>Like</button>
        ))}

      {user &&
        postToDelete === null &&
        (postSaved ? (
          <button onClick={handleSave}>Unsave</button>
        ) : (
          <button onClick={handleSave}>Save</button>
        ))}

      {user && !postToDelete && user.id === post.userId && (
        <button onClick={() => setToggleEdit(!toggleEdit)}>Edit</button>
      )}

      {user && (user.id === post.userId || user.role === "admin") && (
        <>
          {postToDelete !== post.id && (
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          )}
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

      <h2>Comments</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea
            name="comment"
            id="comment"
            placeholder="Add a comment"
            rows="4"
            cols="25"
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Log in to comment on this post</p>
      )}
      {comments.length === 0 && <p>No comments yet</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <Comment comment={comment} user={user} setError={setError} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostDetails;
