import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Username from "./Username";
import Auth from "./Auth";
import Login from "./Login";
import Signup from "./Signup";
import NavDropdown from "./NavDropdown";
import axios from "axios";

function Nav(props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, setUser, isAuthenticated, setIsAuthenticated } = props;

  const logOut = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav>
        <div className="nav__section">
          <a href="/">
            <span className="logo">UUMF</span>
          </a>
        </div>
        <div className="nav__section">
          <SearchBar />
        </div>
        <div className="nav__section">
          <Auth
            user={user}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            showSignup={showSignup}
            setShowSignup={setShowSignup}
            setShowDropdown={setShowDropdown}
            showDropdown={showDropdown}
          />
        </div>
      </nav>
      {showLogin && <Login />}
      {showSignup && <Signup />}
      {user && showDropdown && (
        <NavDropdown
          user={user}
          logOut={logOut}
          setShowDropdown={setShowDropdown}
        />
      )}
    </>
  );
}

export default Nav;
