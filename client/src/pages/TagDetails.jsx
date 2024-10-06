import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import axios from "axios";

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
        setError("Error fetching tag");
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
        setError("Error fetching number of posts");
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
        setError("Error fetching posts");
      }
    };

    fetchPosts();
  }, [tag]);

  if (!tag) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>#{tag.name}</h1>
      {numberOfPosts === 1 ? <p>1 post</p> : <p>{numberOfPosts} posts</p>}
      <h2>Posts</h2>
      <ul>
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
    </div>
  );
}

export default TagDetails;
