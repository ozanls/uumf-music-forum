import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import alterHex from "../utilities/alterHex";
import usePageTitle from "../utilities/usePageTitle";

function TagDetails(props) {
  const { boardName, tagName } = useParams();
  const [tag, setTag] = useState(null);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const { user, setMessage } = props;

  // Set the page title
  usePageTitle(`#${tagName} /${boardName}/`);

  useEffect(() => {
    const fetchTag = async () => {
      // If boardName or tagName is not provided, return
      if (!boardName) {
        setMessage({ type: "error", message: "Board name is not defined" });
        return;
      }
      if (!tagName) {
        setMessage({ type: "error", message: "Tag ID is not defined" });
        return;
      }

      // Send a GET request to the server to get the tag details
      // GET /tags/find/:boardName/:
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/find/${boardName}/${tagName}`
        );

        // Update the tag state
        setTag(response.data);

        // If there is an error fetching the tag, display an error message
      } catch (error) {
        console.error("Error fetching tag:", error);
      }
    };

    fetchTag();
  }, [tagName, boardName]);

  useEffect(() => {
    // If tag is not loaded, return
    if (!tag) {
      return;
    }

    const fetchPosts = async () => {
      // Send a GET request to the server to get the posts with the tag
      // GET /tags/posts/:tagId
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/posts/${tag.id}`
        );

        // Update the posts state
        setPosts(response.data);

        // If there is an error fetching posts, display an error message
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchNumberOfPosts = async () => {
      // Send a GET request to the server to get the number of posts with the tag
      // GET /tags/count/:tagId
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/count/${tag.id}`
        );

        // Update the number of posts state
        setNumberOfPosts(response.data.count);

        // If there is an error fetching the number of posts, display an error message
      } catch (error) {
        console.error("Error fetching number of posts:", error);
      }
    };

    fetchNumberOfPosts();
    fetchPosts();
  }, [tag]);

  // If tag is not loaded, return a placeholder
  if (!tag) {
    return (
      <main className="tag-details">
        <section
          className="page__header"
          style={{
            backgroundImage: `linear-gradient(45deg, #000000 0%, #767676 100%)`,
          }}
        >
          <h2>/{boardName}/</h2>
          <h1>#{tagName}</h1>
          <span>0 posts</span>
        </section>
      </main>
    );
  }

  // Generate a lighter hex code for the tag background
  const lighterHex = alterHex(tag.hexCode, 25);

  return (
    <main className="tag-details">
      {/* Tag Header  */}
      <section
        className="page__header"
        style={{
          backgroundImage: `linear-gradient(45deg, ${tag.hexCode} 0%, ${lighterHex} 100%)`,
        }}
      >
        <h2>/{boardName}/</h2>
        <h1 className="tag-details__name">#{tag.name}</h1>
        {numberOfPosts === 1 ? (
          <span>1 post</span>
        ) : (
          <span>{numberOfPosts} posts</span>
        )}
      </section>

      {/* Posts  */}
      <section className="tag__posts">
        {posts.length > 0 && (
          <ul className="posts">
            {/* Display each post with the tag using PostCard.jsx */}
            {posts.map((post) => (
              <li key={post.post.id}>
                <PostCard
                  post={post.post}
                  user={user}
                  posts={posts}
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

export default TagDetails;
