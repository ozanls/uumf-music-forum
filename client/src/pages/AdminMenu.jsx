import { useNavigate } from 'react-router-dom';

function AdminMenu(props) {
    const { user, setError } = props;
    const navigate = useNavigate();

    if (user && user.role === 'admin') {
        return (
            <h1>Admin Menu</h1>
        );
    } else {
        setError('You do not have permission to access this page');
        return (
            <button onClick={() => navigate(-1)}>Go Back</button>
        );
    }
}

export default AdminMenu;