import React from 'react';
import axios from 'axios';

function Login() {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        console.log("Logging in with:", username, password);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/auth`, {
                username,
                password
            }, { withCredentials: true });

            if (response.status === 200) {
                console.log("Login successful:", response);
                window.location.href = "/";
            } else {
                console.error("Login failed:", response);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
            <button type="submit">Log In</button>
        </form>
    );
}

export default Login;