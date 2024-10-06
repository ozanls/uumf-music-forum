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
        console.log("userData:", response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserData();
  }, [username]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${userData.id}/posts`
        );
        setPosts(response.data);
        console.log("posts:", response.data);
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
        console.log(savedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    if (userData && user && userData.id === user.id) {
      getSavedPosts();
    }

    getComments();
    getPosts();
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {userData.username} ({userData.role})
      </h1>
      <p>Member since {new Date(userData.createdAt).toLocaleDateString()}</p>
      <p>{userData.bio}</p>
      <img src={`.././public/${userData.image}`} alt={userData.username} />

      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} user={user} />
          </li>
        ))}
      </ul>

      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <Comment comment={comment} user={user} />
          </li>
        ))}
      </ul>

      {userData && user && userData.id === user.id && (
        <>
          <h2>Saved Posts</h2>
          <ul>
            {savedPosts.map((post) => (
              <li key={post.id}>
                <PostCard post={post.post} user={user} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserDetails;
