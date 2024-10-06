import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminMenu(props) {
  const { user, setError } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("Log in to access this page");
    } else {
      setError("");
    }
  }, [user, setError]);

  if (user && user.role === "admin") {
    return <h1>Admin Menu</h1>;
  } else {
    return <button onClick={() => navigate(-1)}>Go Back</button>;
  }
}

export default AdminMenu;
