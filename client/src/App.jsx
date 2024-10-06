import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import BoardsList from "./pages/BoardsList";
import BoardDetails from "./pages/BoardDetails";
import TagDetails from "./pages/TagDetails";
import UserDetails from "./pages/UserDetails";
import PostDetails from "./pages/PostDetails";
import SearchResults from "./pages/SearchResults";
import AdminMenu from "./pages/AdminMenu";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
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
    <>
      <Router>
        <Nav
          user={user}
          setUser={setUser}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        {error && <p>{error}</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/b" element={<BoardsList />} />
          <Route
            path="/b/:name"
            element={<BoardDetails user={user} setError={setError} />}
          />
          <Route
            path="/p/:postId"
            element={<PostDetails user={user} setError={setError} />}
          />
          <Route
            path="/t/:tagName"
            element={<TagDetails user={user} setError={setError} />}
          />
          <Route
            path="/s/:board/:query"
            element={<SearchResults user={user} setError={setError} />}
          />
          <Route
            path="/u/:username"
            element={<UserDetails user={user} setError={setError} />}
          />
          <Route
            path="/new"
            element={<CreatePost user={user} setError={setError} />}
          />
          <Route
            path="/admin"
            element={<AdminMenu user={user} setError={setError} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
