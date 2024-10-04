import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import BoardsList from './components/BoardsList';
import BoardDetails from './components/BoardDetails';
import Post from './components/Post';
import Nav from './components/Nav';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

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

    return (
        <>
            <Nav user={user} setUser={setUser} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}  />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<h1>About</h1>} />
                    <Route path="/b" element={<BoardsList />} />
                    <Route path="/b/:name" element={<BoardDetails user={user}/>} />
                    <Route path="/p/:postId" element={<Post user={user}/>} />
                    <Route path="/new" element={<CreatePost />} />
                    <Route path="/admin" element={<p>Admin Menu</p>} />
                </Routes>
            </Router>
        </>
    );
}

export default App;