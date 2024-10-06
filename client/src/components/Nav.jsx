import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Auth from "./Auth";
import Login from "./Login";
import Signup from "./Signup";
import logo from "../assets/logo.png";

function Nav(props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, setUser, isAuthenticated, setIsAuthenticated } = props;

  return (
    <>
      <nav>
        <a href="/">
          <img src={logo} className="nav__logo" alt="UUMF Logo" />
        </a>
        <SearchBar />
        {user && (
          <button onClick={() => (window.location.href = "/new")}>
            + Create a Post
          </button>
        )}
        {user && user.role === "admin" && (
          <button onClick={() => (window.location.href = "/admin")}>
            Admin Menu
          </button>
        )}
        <Auth
          user={user}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showSignup={showSignup}
          setShowSignup={setShowSignup}
        />
      </nav>
      {showLogin && <Login />}
      {showSignup && <Signup />}
    </>
  );
}

export default Nav;
