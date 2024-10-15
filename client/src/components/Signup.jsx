import { useState } from "react";
import axios from "axios";

function Signup() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showSignup, setShowSignup] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the username, email, password, confirmPassword and agreedToTerms value from the form
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const agreedToTerms = e.target.agreedToTerms.checked;

    // Send a POST request to the server to register the user
    // POST /users/register
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/register`,
        {
          username,
          email,
          password,
          confirmPassword,
          agreedToTerms,
        },
        { withCredentials: true }
      );

      // If the user is registered successfully, display a success message and hide the signup form
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowMessage(true);
        setShowSignup(false);
      }

      // If there is an error registering the user, display an error message
    } catch (error) {
      console.error("Error signing up:", error);

      // If the error response has a message, display the message, else display a generic error message
      if (error.response.data.message) {
        setMessage({ type: "error", message: error.response.data.message });

        // Else, display a generic error message
      } else {
        setMessage({ type: "error", message: "Signup failed, try again." });
      }

      // Show the error message
      setShowMessage(true);
    }
  };

  return (
    <div className="auth-form">
      {/* If there is a message, display the message */}
      {showMessage && <p className="auth-form__message">{message}</p>}

      {/* If showSignup is true, display the signup form */}
      {showSignup && (
        // Signup Form
        <form className="auth-form__signup" onSubmit={handleSubmit}>
          {/* Email */}
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />

          {/* Username */}
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />

          {/* Confirm Password */}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />

          {/* Agreed to Terms */}
          <div className="auth-form__signup__checkbox">
            <input type="checkbox" id="agreedToTerms" name="agreedToTerms" />
            <label htmlFor="agreedToTerms">
              You've read and agreed to our{" "}
              <a href="/rules">
                <u>rules</u>
              </a>{" "}
              and{" "}
              <a href="/terms">
                <u>terms and conditions</u>
              </a>
            </label>
          </div>

          {/* Receive Promotional Emails */}
          <div className="auth-form__signup__checkbox">
            <input type="checkbox" id="receivePromo" name="receivePromo" />
            <label htmlFor="receivePromo">Receive promotional emails?</label>
          </div>

          {/* Submit Button */}
          <button className="basic-button-2" type="submit">
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
}

export default Signup;
