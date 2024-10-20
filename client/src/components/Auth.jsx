import Username from "./Username";

function Auth(props) {
  const {
    user,
    isAuthenticated,
    showLogin,
    showSignup,
    setShowLogin,
    setShowSignup,
    setShowDropdown,
    showDropdown,
  } = props;

  // Toggle login form
  const toggleLogin = () => {
    setShowSignup(false);
    setShowLogin(!showLogin);
  };

  // Toggle signup form
  const toggleSignup = () => {
    setShowLogin(false);
    setShowSignup(!showSignup);
  };

  return (
    <>
      <div className="auth">
        {/* If user is authenticated, display '+ Create a Post' and user dropdown */}
        {isAuthenticated ? (
          <>
            {/* Create a Post */}
            <button
              className="basic-button"
              onClick={() => (window.location.href = `/new`)}
            >
              + Create a Post
            </button>

            {/* User Dropdown */}
            <button
              className="basic-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              @{user.username} <i className="fa-solid fa-chevron-down"></i>
            </button>
          </>
        ) : (
          // If user is not authenticated, display 'Log In' and 'Sign Up' buttons
          <>
            <button className="basic-button" onClick={toggleLogin}>
              Log In
            </button>
            <button className="basic-button" onClick={toggleSignup}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Auth;
