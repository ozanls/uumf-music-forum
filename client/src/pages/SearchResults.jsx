import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import usePageTitle from "../utilities/usePageTitle";

function SearchResults(props) {
  const { user } = props;
  const { boardName, query } = useParams();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  // Set the page title
  usePageTitle(`Results for '${query}' in /${boardName}/`);

  useEffect(() => {
    // If boardName or query is not provided, return
    if (!boardName && !query) {
      return;
    }

    const handleSearch = async () => {
      // Send a GET request to the server to search for posts
      // GET /posts/search/:boardName/:query
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/posts/search/${boardName}/${query}`
        );

        // If response contains a message, display the message
        if (response.data.message) {
          setMessage(response.data.message);
          setPosts([]);

          // If response contains posts, update the posts state
        } else {
          setPosts(response.data);
          setMessage({ type: "", message: "" });
        }

        // If there is an error fetching search results, display an error message
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    handleSearch();
  }, [boardName, query]);

  return (
    <main className="search-results">
      {/* Search Results Header*/}
      <section className="page__header">
        <h2>Search results for </h2>
        <h1>'{query}'</h1>
        {posts && posts.length === 0 ? (
          <span>0 results found</span>
        ) : (
          <span>
            {posts.length} results found in /{boardName}/
          </span>
        )}
      </section>

      {/* Posts*/}
      <section className="page__content">
        {posts && posts.length > 0 && (
          <>
            <ul className="posts">
              {/* Display each post in the search results using PostCard.jsx */}
              {posts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} user={user} posts={posts} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default SearchResults;
