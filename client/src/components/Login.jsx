import { useState, useRef } from "react";
import axios from "axios";
import ResetPassword from "./ResetPassword";
import ReCAPTCHA from "react-google-recaptcha";

function Login(props) {
  const { setMessage } = props;
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [recaptcha, setRecaptcha] = useState(null);
  const recaptchaRef = useRef(null);

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
        window.location.reload();

        // If there is an error authenticating the user, display an error message
      } else {
        console.log(response.message);
        setMessage({ type: "error", message: response.message });
        console.error("Login failed:", response);
      }

      // If there is an error authenticating the user, display an error message
    } catch (error) {
      // If the error response has a message, display the message, else display a generic error message
      if (error.response.data.message) {
        setMessage({ type: "error", message: error.response.data.message });

        // Else, display a generic error message
      } else {
        setMessage({ type: "error", message: "Login failed, try again." });
      }
    } finally {
      // Reset the ReCAPTCHA widget after each login attempt
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptcha(null);
      }
    }
  };

  return (
    <div className="auth-form">
      {/* If showResetPassword is true, show the ResetPassword component*/}
      {showResetPassword && <ResetPassword setMessage={setMessage} />}

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

            {/* ReCAPTCHA */}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(i) => setRecaptcha(i)}
            />

            {/* Log In Button */}
            <button
              disabled={!recaptcha}
              className="basic-button-2"
              type="submit"
            >
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
