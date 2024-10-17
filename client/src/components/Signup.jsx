import { useState, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function Signup(props) {
  const { setMessage } = props;
  const [showSignup, setShowSignup] = useState(true);
  const [recaptcha, setRecaptcha] = useState(null);
  const recaptchaRef = useRef(null);

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
          recaptchaToken: recaptcha,
        },
        { withCredentials: true }
      );

      // If the user is registered successfully, display a success message and hide the signup form
      if (response.status === 201) {
        setMessage({ type: "success", message: response.data.message });
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

          {/* ReCAPTCHA */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(i) => setRecaptcha(i)}
          />

          {/* Submit Button */}
          <button
            disabled={!recaptcha}
            className="basic-button-2"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
}

export default Signup;
