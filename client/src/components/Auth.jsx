import Username from "./Username";
import BasicButton from "./buttons/BasicButton";

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
            <BasicButton
              handleAction={() => (window.location.href = `/new`)}
              text={<>Create a Post</>}
            />

            {/* User Dropdown */}
            <BasicButton
              handleAction={() => setShowDropdown(!showDropdown)}
              text={
                <>
                  @{user.username} <i className="fa-solid fa-chevron-down"></i>
                </>
              }
            />
          </>
        ) : (
          // If user is not authenticated, display 'Log In' and 'Sign Up' buttons
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
