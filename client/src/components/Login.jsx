import { useState, useEffect } from "react";
import axios from "axios";
import ResetPassword from "./ResetPassword";

function Login() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("Logging in with:", email, password);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/auth`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Login successful:", response);
        setMessage("Login successful! Please wait...");
        setShowMessage(true);
        window.location.reload();
      } else {
        console.log(response.message);
        setMessage(response.message);
        setShowMessage(true);
        console.error("Login failed:", response);
      }
    } catch (error) {
      setMessage(error.response.data.message);
      setShowMessage(true);
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="auth-form">
      {showResetPassword && (
        <ResetPassword
          setMessage={setMessage}
          setShowMessage={setShowMessage}
          showMessage={showMessage}
        />
      )}
      {!showResetPassword && (
        <>
          <form className="auth-form__signup" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
            <button type="submit">Log In</button>
          </form>
          <a onClick={() => setShowResetPassword(true)}>
            Forgot your password?
          </a>
        </>
      )}
      {showMessage && <p className="auth-form__message">{message}</p>}
    </div>
  );
}

export default Login;
