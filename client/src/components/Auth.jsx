import { useState, useEffect } from "react";
import axios from 'axios';

function Auth(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const showLogin = props.showLogin;
    const showSignup = props.showSignup;
    const setShowLogin = props.setShowLogin;
    const setShowSignup = props.setShowSignup;


    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/auth/status`, { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setUser(response.data);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, []);

    const logOut = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/auth/logout`, {}, { withCredentials: true });
            if (response.status === 200) {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const toggleLogin = () => {
        setShowSignup(false);
        setShowLogin(!showLogin);
    }

    const toggleSignup = () => {
        setShowLogin(false);
        setShowSignup(!showSignup);
        console.log(user);
    }

    return (
        <>
        <div className="auth">
            {isAuthenticated ? (
                <>
                    <p className="auth__welcome">Welcome, {user.username}!</p>
                    <button className='button-1' onClick={logOut}>Log Out</button>
                </>
            ) : (
                <>
                    <button className='button-1' onClick={toggleLogin}>Log In</button>
                    <button className='button-1' onClick={toggleSignup}>Sign Up</button>
                </>
            )}
        </div>
        </>
    );
}

export default Auth;