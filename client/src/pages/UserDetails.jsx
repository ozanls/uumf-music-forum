import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import Comment from "../components/Comment";

function UserDetails(props) {
  const { user } = props;
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/username/${username}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserData();
  }, [username]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    const getPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/posts`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    const getComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    const getSavedPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/saved`,
          {
            withCredentials: true,
          }
        );
        setSavedPosts(response.data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    if (user && userData.id === user.id) {
      getSavedPosts();
    }

    getComments();
    getPosts();
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="user">
      <section className="page__header">
        <h1>@{userData.username}</h1>
        <span>Role: {userData.role}</span>
        <span>
          Member since:{" "}
          <time>{new Date(userData.createdAt).toLocaleDateString()}</time>
        </span>
        <p>{userData.bio}</p>
      </section>
      <h2>Posts</h2>
      <ul className="posts">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} user={user} />
          </li>
        ))}
      </ul>

      <h2>Comments</h2>
      <ul className="comments">
        {comments.map((comment) => (
          <li key={comment.id}>
            <Comment comment={comment} user={user} />
          </li>
        ))}
      </ul>

      {userData && user && userData.id === user.id && savedPosts && (
        <>
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
        </>
      )}
    </main>
  );
}

export default UserDetails;
