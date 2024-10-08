import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import axios from "axios";

function SearchResults(props) {
  const { user } = props;
  const { board, query } = useParams();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/posts/search/${board}/${query}`
        );
        if (response.data.message) {
          setMessage(response.data.message);
          setPosts([]);
        } else {
          setPosts(response.data);
          setMessage("");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (board && query) {
      handleSearch();
    } else {
      return;
    }
  }, [board, query]);

  return (
    <section className="search-results">
      <h1>Search Results</h1>
      <p>Board: {board}</p>
      <p>Search query: {query}</p>

      <h2>Posts</h2>

      {message && <p>{message}</p>}
      {posts && posts.length > 0 && (
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} user={user} posts={posts} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SearchResults;
