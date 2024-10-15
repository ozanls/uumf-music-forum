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
          setMessage({ type: "", message: "" });
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
    <main className="search-results">
      <section className="page__header">
        <h2>Search results for </h2>
        <h1>'{query}'</h1>
        {posts && posts.length === 0 ? (
          <span>0 results found</span>
        ) : (
          <span>
            {posts.length} results found in /{board}/
          </span>
        )}
      </section>

      <section className="page__content">
        <h2>Search Results</h2>
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
    </main>
  );
}

export default SearchResults;
