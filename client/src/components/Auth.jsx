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
              <BasicButton
                handleAction={() => setShowDropdown(!showDropdown)}
                text={user.username}
              />
            </p>
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
