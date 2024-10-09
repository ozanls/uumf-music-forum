import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Auth from "./Auth";
import Login from "./Login";
import Signup from "./Signup";
import logo from "../assets/logo.png";
import BasicButton from "./buttons/BasicButton";

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
          <BasicButton
            onClick={() => (window.location.href = "/new")}
            text="+ Create a Post"
          />
        )}
        {user && user.role === "admin" && (
          <BasicButton
            onClick={() => (window.location.href = "/admin")}
            text="Admin Menu"
          />
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
