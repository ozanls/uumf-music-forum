import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import alterHex from "../utilities/alterHex";

function TagDetails(props) {
  const { boardName, tagName } = useParams();
  const [tag, setTag] = useState(null);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const { user, setMessage } = props;

  useEffect(() => {
    const fetchTag = async () => {
      if (!boardName) {
        setMessage({ type: "error", message: "Board name is not defined" });
        return;
      }
      if (!tagName) {
        setMessage({ type: "error", message: "Tag ID is not defined" });
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/find/${boardName}/${tagName}`
        );
        setTag(response.data);
      } catch (error) {
        console.error("Error fetching tag:", error);
      }
    };

    fetchTag();
  }, [tagName, boardName]);

  useEffect(() => {
    if (!tag) {
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/posts/${tag.id}`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchNumberOfPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tags/count/${tag.id}`
        );
        setNumberOfPosts(response.data.count);
      } catch (error) {
        console.error("Error fetching number of posts:", error);
      }
    };

    fetchNumberOfPosts();

    fetchPosts();
  }, [tag]);

  if (!tag) {
    return (
      <main className="tag-details">
        <section
          className="tag__header"
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

  const lighterHex = alterHex(tag.hexCode, 20);

  return (
    <main className="tag-details">
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
      <section className="tag__posts">
        {posts.length > 0 && (
          <ul className="posts">
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
