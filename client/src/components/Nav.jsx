import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Auth from "./Auth";
import Login from './Login';
import Signup from './Signup';
import logo from "../assets/logo.png";

function Nav() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
    <nav>
      <a href="/">
          <img src={logo} className="nav__logo" alt="UUMF Logo" />
      </a>    
      <SearchBar />
      <Auth 
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
