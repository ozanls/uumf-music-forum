import axios from 'axios';

function ResetPassword(props) {

    const { setMessage, setShowMessage, showMessage } = props;


    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        console.log("Resetting password for:", email);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/forgot-password`, {
                email
            }, { withCredentials: true });
            setMessage(response.data.message);
            setShowMessage(true);
        } catch (error) {
            if (error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Error resetting password, try again.");
            }
            setShowMessage(true);
            console.error("Error resetting password:", error);
        }
    }

  return (
    <>
    {!showMessage && (
        <form className="auth-form__reset-password" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
            <button type="submit">Reset Password</button>
        </form>
    )}
</>
  );
}

export default ResetPassword;
