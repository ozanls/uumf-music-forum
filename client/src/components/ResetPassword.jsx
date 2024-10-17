import axios from "axios";

function ResetPassword(props) {
  const { setMessage } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the email from the form
    const email = e.target.email.value;
    console.log("Resetting password for:", email);

    if (!email) {
      setMessage({ type: "error", message: "Email is required" });
      return;
    }

    // Send a POST request to the server to reset the password
    // POST /users/forgot-password
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/forgot-password`,
        {
          email,
          recaptchaToken: recaptcha,
        },
        { withCredentials: true }
      );

      // If the password is reset successfully, display a success message
      setMessage({ type: "error", message: response.data.message });

      // If there is an error resetting the password, display an error message
    } catch (error) {
      // If the error response has a message, display the message, else display a generic error message
      if (error.response.data.message) {
        setMessage({ type: "error", message: error.response.data.message });

        // Else, display a generic error message
      } else {
        setMessage({
          type: "error",
          message: "Error resetting password, try again.",
        });
      }

      // Show the error message
    }
  };

  return (
    <>
      {/* If message isn't showing, show the password reset form*/}
      <form className="auth-form__reset-password" onSubmit={handleSubmit}>
        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />

        {/* Reset Password Button */}
        <button className="basic-button-2" type="submit">
          Reset Password
        </button>
      </form>
    </>
  );
}

export default ResetPassword;
