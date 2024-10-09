import { useState, useEffect } from "react";
import BasicButton from "./buttons/BasicButton";
import axios from "axios";

function Auth(props) {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    showLogin,
    showSignup,
    setShowLogin,
    setShowSignup,
  } = props;

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

  const toggleLogin = () => {
    setShowSignup(false);
    setShowLogin(!showLogin);
  };

  const toggleSignup = () => {
    setShowLogin(false);
    setShowSignup(!showSignup);
  };

  return (
    <>
      <div className="auth">
        {isAuthenticated ? (
          <>
            <p className="auth__welcome">
              Welcome, <a href={`/u/${user.username}`}>{user.username}</a>!
            </p>
            <button onClick={logOut}>Log Out</button>
          </>
        ) : (
          <>
            <BasicButton handleAction={toggleLogin} text="Log In" />
            <BasicButton handleAction={toggleSignup} text="Sign Up" />
          </>
        )}
      </div>
    </>
  );
}

export default Auth;
