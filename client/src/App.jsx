import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import BoardDetails from "./pages/BoardDetails";
import BoardTags from "./pages/BoardTags";
import TagDetails from "./pages/TagDetails";
import UserDetails from "./pages/UserDetails";
import PostDetails from "./pages/PostDetails";
import SearchResults from "./pages/SearchResults";
import AdminMenu from "./pages/AdminMenu";
import Nav from "./components/Nav";
import Message from "./components/Message";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import TermsAndConditions from "./pages/TermsAndConditions";
import PageNotFound from "./pages/PageNotFound";
import Rules from "./pages/Rules";
import About from "./pages/About";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", message: "" });

  // Check the authentication status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Send a GET request to the server to check the authentication status
      // GET /users/auth/status
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/auth/status`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Router>
      <Nav
        user={user}
        setUser={setUser}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setMessage={setMessage}
      />
      {message.message && (
        <Message type={message.type} message={message.message} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/b/:boardName"
          element={<BoardDetails user={user} setMessage={setMessage} />}
        />
        <Route
          path="/post/:postId"
          element={<PostDetails user={user} setMessage={setMessage} />}
        />
        <Route
          path="/b/:boardName/tags"
          element={<BoardTags user={user} setMessage={setMessage} />}
        />
        <Route
          path="/b/:boardName/tag/:tagName"
          element={<TagDetails user={user} setMessage={setMessage} />}
        />
        <Route
          path="/search/:boardName/:query"
          element={<SearchResults user={user} setMessage={setMessage} />}
        />
        <Route
          path="/u/:username"
          element={<UserDetails user={user} setMessage={setMessage} />}
        />
        <Route
          path="/new"
          element={<CreatePost user={user} setMessage={setMessage} />}
        />
        <Route
          path="/admin"
          element={<AdminMenu user={user} setMessage={setMessage} />}
        />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
