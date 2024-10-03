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

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setShowMessage(true);
      return;
    }

    console.log("Signing up with:", username, password, email);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/register`, {
        username,
        email,
        password,
        confirmPassword
      }, { withCredentials: true });

      if (response.status === 201) {
        setMessage("Signup successful! Check your email to verify your account before logging in.");
        setShowMessage(true);
        setShowSignup(false);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Signup failed, try again.");
      }
      setShowMessage(true);
    }
  };

  return (
    <div className='auth-form'>
      {showSignup && 
        <form className='auth-form__signup' onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
          
          <button type="submit">Sign Up</button>
        </form>
      } 
      {showMessage && <p className="auth-form__message">{message}</p>}
    </div>
  );
}

export default Signup;