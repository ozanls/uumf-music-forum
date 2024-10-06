import { useState } from "react";
import axios from "axios";

function Signup() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showSignup, setShowSignup] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const agreedToTerms = e.target.agreedToTerms.checked;

    console.log("Signing up with:", username, password, email);

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

      if (response.status === 201) {
        console.log(response);
        setMessage(response.data.message);
        setShowMessage(true);
        setShowSignup(false);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Signup failed, try again.");
      }
      setShowMessage(true);
    }
  };

  return (
    <div className="auth-form">
      {showMessage && <p className="auth-form__message">{message}</p>}
      {showSignup && (
        <form className="auth-form__signup" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
          <div className="auth-form__signup__checkbox">
            <input type="checkbox" id="agreedToTerms" name="agreedToTerms" />
            <label htmlFor="agreedToTerms">
              You've read and agreed to our terms of service
            </label>
          </div>
          <div className="auth-form__signup__checkbox">
            <input type="checkbox" id="receivePromo" name="receivePromo" />
            <label htmlFor="receivePromo">Receive promotional emails?</label>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
}

export default Signup;
