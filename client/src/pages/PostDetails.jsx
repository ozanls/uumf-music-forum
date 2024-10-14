import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import formatDate from "../utilities/formatDate";
import Comment from "../components/Comment";
import Username from "../components/Username";
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
    <section className="post">
      <span>
        <Username user={post.user} /> {"· "}
        <time>
          {formatDate(post.createdAt)}
          {post.createdAt !== post.updatedAt &&
            ` (edited ${formatDate(post.updatedAt)})`}
        </time>
      </span>
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
        <ul className="tags">
          {tags.map((tag) => (
            <Tag key={tag.id} tag={tag.tag} />
          ))}
        </ul>
      )}

      <div className="stats">
        <span className="stat-icon">
          <i className="fa-solid fa-comment icon"></i>
          {post.comments}
        </span>
        <span className="stat-icon">
          <i className="fa-solid fa-heart like"></i> {likes}
        </span>
      </div>

      <div className="post__actions">
        {user &&
          (postLiked ? (
            <UnlikeButton handleAction={handleLike} text=" Unlike" />
          ) : (
            <LikeButton handleAction={handleLike} text=" Like" />
          ))}

        {user &&
          (postSaved ? (
            <BasicButton handleAction={handleSave} text=" Unsave" />
          ) : (
            <BasicButton handleAction={handleSave} text=" Save" />
          ))}

        {user && user.id === post.userId && (
          <BasicButton
            handleAction={() => setToggleEdit(!toggleEdit)}
            text=" Edit"
          />
        )}

        {user && (user.id === post.userId || user.role === "admin") && (
          <>
            {postToDelete !== post.id && (
              <DeleteButton
                handleAction={() => handleDelete(post.id)}
                text="Delete"
              />
            )}
            {postToDelete === post.id && (
              <>
                <span>Are you sure you want to delete this post?</span>
                <button className="delete-button" onClick={confirmDelete}>
                  Yes
                </button>
                <BasicButton handleAction={cancelDelete} text="Cancel" />
              </>
            )}
            {postDeleted && <p>Post deleted</p>}
          </>
        )}
      </div>
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
        <p>Sign Up or Log in to comment on this post</p>
      )}
      {comments.length === 0 && <p>No comments yet</p>}
      <ul className="comments">
        {comments.map((comment) => (
          <li key={comment.id}>
            <Comment comment={comment} user={user} setError={setError} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PostDetails;
