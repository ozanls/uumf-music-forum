import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Username from "./Username";
import formatDate from "../utilities/formatDate";
import Tag from "./Tag";
import axios from "axios";

function PostCard(props) {
  const { post, setMessage } = props;
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchTags();
  }, [post.id]);

  return (
    // Post Card
    <div
      className="post-card"
      onClick={() => navigate(`/p/${post.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Post Card Left (post info, tags)*/}
      <div className="post-card__left">
        <span>
          {/* Username */}
          <Username user={post.user} /> {"· "}
          {/* Post Upload Time */}
          <time>
            {formatDate(post.createdAt)}
            {post.createdAt !== post.updatedAt &&
              ` (edited ${formatDate(post.updatedAt)})`}
          </time>
        </span>

        {/* Post Title and Body */}
        <h3 className="post-card__left__title">{post.title}</h3>
        <p className="post-card__left__body">{post.body}</p>

        {/* Post Tags */}
        {tags.length !== 0 && (
          <>
            <ul className="tags">
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Tag tag={tag.tag} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Post Card Right (likes, comments)*/}
      <div className="post-card__right">
        <div className="stats">
          {/* Comment Count */}
          <span className="stat-icon">
            <i className="fa-solid fa-comment icon"></i>
            {post.comments}
          </span>

          {/* Like Count */}
          <span className="stat-icon">
            <i className="fa-solid fa-heart like"></i> {post.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
