import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Username from "./Username";
import formatDate from "../utilities/formatDate";
import Tag from "./Tag";
import axios from "axios";

function PostCard(props) {
  //const [postToDelete, setPostToDelete] = useState(null);
  //const [postDeleted, setPostDeleted] = useState(false);
  //const { user, setPosts, posts, } = props;
  const { post, setError } = props;
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // const handleDelete = (postId) => {
  //   setPostToDelete(postId);
  // };

  // const cancelDelete = () => {
  //   setPostToDelete(null);
  // };

  // const confirmDelete = async () => {
  //   try {
  //     const response = await axios.delete(
  //       `${import.meta.env.VITE_SERVER_URL}/posts/${postToDelete}`,
  //       { withCredentials: true }
  //     );
  //     if (response.status === 204) {
  //       setPosts(posts.filter((post) => post.id !== postToDelete));
  //       setPostDeleted(true);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     setError("Error deleting post");
  //   }

  //   window.location.reload();
  // };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/tags`
        );
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError("Error fetching tags");
      }
    };

    fetchTags();
  }, [post.id]);

  const handleCardClick = () => {
    navigate(`/p/${post.id}`);
  };

  return (
    <div
      className="post-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <h3>{post.title}</h3>
      {tags.length !== 0 && (
        <>
          <ul className="tags">
            {tags.map((tag) => (
              <Tag key={tag.id} tag={tag.tag} />
            ))}
          </ul>
        </>
      )}
      <span>
        Posted by
        <Username user={post.user} />
      </span>
      {"  "}· <time>{formatDate(post.createdAt)} </time>
      <p>
        {post.likes}
        {post.likes === 1 ? " like" : " likes"} · {post.comments}
        {post.comments === 1 ? " comment" : " comments"}
      </p>
      {/* {user && (user.id === post.userId || user.role === "admin") && (
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
      )} */}
    </div>
  );
}

export default PostCard;
