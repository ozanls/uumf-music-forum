import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Auth from "./Auth";
import Login from "./Login";
import Signup from "./Signup";
import NavDropdown from "./NavDropdown";
import axios from "axios";

function Nav(props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, setUser, isAuthenticated, setIsAuthenticated, setMessage } =
    props;

  const logOut = async () => {
    try {
      // Send a POST request to the server to log out the user
      // POST /users/auth/logout
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/auth/logout`,
        {},
        { withCredentials: true }
      );

      // If the user is logged out successfully, update the isAuthenticated and user state
      if (response.status === 200) {
        setIsAuthenticated(false);
        setUser(null);
      }

      // If there is an error logging out, display an error message
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav>
        {/* Logo */}
        <div className="nav__section">
          <a href="/">
            <span className="logo">UUMF</span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="nav__section">
          <SearchBar />
        </div>

        {/* Auth */}
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

      {/* If showLogin is true, show the Login component*/}
      {showLogin && <Login setMessage={setMessage} />}

      {/* If showSignup is true, show the Signup component*/}
      {showSignup && <Signup setMessage={setMessage} />}

      {/* If user is logged in and showDropdown is true, show the NavDropdown component*/}
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
