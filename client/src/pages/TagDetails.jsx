import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import lightenHex from "../utilities/lightenHex";

function TagDetails(props) {
  const { tagName } = useParams();
  const [tag, setTag] = useState(null);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const { user, setError } = props;

  useEffect(() => {
    const fetchTag = async () => {
      if (!tagName) {
        setError("Tag ID is not defined");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/${tagName}`
        );
        setTag(response.data);
        console.log("tag:", response.data);
      } catch (error) {
        console.error("Error fetching tag:", error);
      }
    };

    const fetchNumberOfPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/${tagName}/count`
        );
        setNumberOfPosts(response.data.count);
      } catch (error) {
        console.error("Error fetching number of posts:", error);
      }
    };

    fetchNumberOfPosts();
    fetchTag();
  }, [tagName]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/${tagName}/posts`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [tag]);

  if (!tag) {
    return (
      <section className="tag-details">
        <div
          className="tag__header"
          style={{
            backgroundImage: `linear-gradient(45deg, #000000 0%, #767676 100%)`,
          }}
        >
          <h1>#{tagName}</h1>
          <span>0 posts</span>
        </div>
      </section>
    );
  }

  const lighterHex = lightenHex(tag.hexCode, 20);

  return (
    <section className="tag-details">
      <div
        className="tag__header"
        style={{
          backgroundImage: `linear-gradient(45deg, ${tag.hexCode} 0%, ${lighterHex} 100%)`,
        }}
      >
        <h1>#{tag.name}</h1>
        {numberOfPosts === 1 ? (
          <span>1 post</span>
        ) : (
          <span>{numberOfPosts} posts</span>
        )}
      </div>
      {posts.length > 0 && (
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.post.id}>
              <PostCard
                post={post.post}
                user={user}
                posts={posts}
                setError={setError}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TagDetails;
