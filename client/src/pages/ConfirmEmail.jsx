import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ConfirmEmail(props) {
  const { setMessage } = props;
  const { token } = useParams();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/users/confirm-email`,
          { token }
        );
        setMessage({
          type: "success",
          message: "Email confirmed! You can now log in.",
        });
      } catch (error) {
        console.error("Error confirming email:", error);
        setMessage({
          type: "error",
          message: "Error confirming email. Please try again.",
        });
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <main>
      <section className="page__content">
        <button
          className="basic-button-3"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </section>
    </main>
  );
}

export default ConfirmEmail;
