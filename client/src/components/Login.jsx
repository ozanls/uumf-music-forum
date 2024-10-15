import { useState, useEffect } from "react";
import axios from "axios";
import ResetPassword from "./ResetPassword";

function Login() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the email and password from the form
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Send a POST request to the server to authenticate the user
    // POST /users/auth
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/auth`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // If the user is authenticated successfully, display a success message and reload the page
      if (response.status === 200) {
        console.log("Login successful:", response);
        setMessage({
          type: "success",
          message: "Login successful! Please wait...",
        });
        setShowMessage(true);
        window.location.reload();

        // If there is an error authenticating the user, display an error message
      } else {
        console.log(response.message);
        setMessage(response.message);
        setShowMessage(true);
        console.error("Login failed:", response);
      }

      // If there is an error authenticating the user, display an error message
    } catch (error) {
      setMessage(error.response.data.message);
      setShowMessage(true);
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="auth-form">
      {/* If showMessage is true, show the message*/}
      {showMessage && <p className="auth-form__message">{message}</p>}

      {/* If showResetPassword is true, show the ResetPassword component*/}
      {showResetPassword && (
        <ResetPassword
          setMessage={setMessage}
          setShowMessage={setShowMessage}
          showMessage={showMessage}
        />
      )}

      {/* If showResetPassword is false, show the login form*/}
      {!showResetPassword && (
        <>
          <form className="auth-form__signup" onSubmit={handleSubmit}>
            {/* Email Input */}
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" />

            {/* Password Input */}
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />

            {/* Log In Button */}
            <button className="basic-button-2" type="submit">
              Log In
            </button>
          </form>
          <a onClick={() => setShowResetPassword(true)}>
            <u>Forgot your password?</u>
          </a>
        </>
      )}
    </div>
  );
}

export default Login;
