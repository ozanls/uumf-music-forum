import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import Comment from "../components/Comment";

function UserDetails(props) {
  const { user, setMessage } = props;
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      // Send a GET request to the server to get the user details
      // GET /users/username/:username
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/username/${username}`
        );

        // Update the user state
        setUserData(response.data);

        // If there is an error fetching the user, display an error message
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage({ type: "error", message: "User Not Found" });
      }
    };

    getUserData();
  }, [username]);

  useEffect(() => {
    // If userData is not loaded, return
    if (!userData) {
      return;
    }

    const getPosts = async () => {
      try {
        // Send a GET request to the server to get the posts for the user
        // GET /users/:userId/posts
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/posts`
        );

        // Update the posts state
        setPosts(response.data);

        // If there is an error fetching posts, display an error message
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const getComments = async () => {
      // Send a GET request to the server to get the comments for the user
      // GET /users/:userId/comments
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/comments`
        );

        // Update the comments state
        setComments(response.data);

        // If there is an error fetching comments, display an error message
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const getSavedPosts = async () => {
      // Send a GET request to the server to get the saved posts for the user
      // GET /users/:userId/saved
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/saved`,
          {
            withCredentials: true,
          }
        );

        // Update the saved posts state
        setSavedPosts(response.data);

        // If there is an error fetching saved posts, display an error message
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    // If user is loaded and the user is the same as the logged in user, get saved posts
    if (user && userData.id === user.id) {
      getSavedPosts();
    }

    getComments();
    getPosts();
  }, [userData]);

  // If userData is not loaded, return an empty main element
  if (!userData) {
    return <main className="user"></main>;
  }

  return (
    <main className="user">
      {/* User Details Header */}
      <section className="page__header">
        <h1>@{userData.username}</h1>
        <span>Role: {userData.role}</span>
        <span>
          Member since:{" "}
          <time>{new Date(userData.createdAt).toLocaleDateString()}</time>
        </span>
        <p>{userData.bio}</p>
      </section>

      {/* User Posts */}
      <section className="user__posts">
        <h2>Posts</h2>
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} user={user} />
            </li>
          ))}
        </ul>
      </section>

      {/* User Comments */}
      <section className="user__comments">
        <h2>Comments</h2>
        <ul className="comments">
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment comment={comment} user={user} />
            </li>
          ))}
        </ul>
      </section>

      {/* If userData and user are loaded, the user is the same as the logged in user, and savedPosts is loaded, show User Saved Posts */}
      {userData && user && userData.id === user.id && savedPosts && (
        //User Saved Posts
        <section className="user__saves">
          <h2>Saved Posts</h2>
          {savedPosts.length === 0 ? (
            <p>No saved posts.</p>
          ) : (
            <ul className="posts">
              {savedPosts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post.post} user={user} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

export default UserDetails;
