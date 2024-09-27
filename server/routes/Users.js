const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');
const { hashPassword } = require('../utilities/hashing');
const { isAuthenticated, verifyAuthorization } = require('../utilities/auth');

// Authenticate a user (login)
router.post('/auth', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            return res.json({ message: 'Login successful' });
        });
    })(req, res, next);
});

// Un-authenticate a user (logout)
router.post('/auth/logout', (req, res) => {
    !req.user ? res.status(401).json({ message: 'Unauthorized' }) : req.logout((err) => {
        err ? res.status(500).json({ message: 'Server error' }) : res.status(200).json({ message: 'Logout Successful' });
    });
});

// Verify authentication status
router.get('/auth/status', isAuthenticated, (req, res) => {
    try{
    req.isAuthenticated() ? res.json(req.user) : res.status(401).json({ message: 'Unauthorized' });
    }
    catch(error){
        console.error('Error getting authentication status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users
router.get('/', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    try{
        const allUsers = await User.findAll();
        res.json(allUsers);
    }
    catch(error){
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a user by id
router.get('/:id', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findByPk(userId);
        user ? res.json(user) : res.json({ message: 'User not found' });
    }
    catch(error){
        console.error('Error getting user by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
// Create a new user (register)
router.post('/register', async (req, res) => {
    const user = req.body;
    user.password = await hashPassword(user.password);

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username: user.username } });
    
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    await User.create(user);
    res.json(user);
});

// Update a user
router.post('/:id', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    const user = req.body;
    const userId = req.params.id;
    try{
        await User.update(user, { where: { id: userId } });
        res.json(user);
    }
    catch(error){
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a user account
router.delete('/:id', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        // If the user is deleting their own account, log them out and destroy the session
        if (userId == req.user.id) {
            req.logout((err) => {
                if (err) {
                    return res.status(500).json({ error: 'An error occurred while logging out' });
                }
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({ error: 'An error occurred while destroying the session' });
                    }
                    res.status(200).json({ message: 'User account deleted successfully' });
                });
            });
        } else {
            res.status(200).json({ message: 'User account deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the user account' });
    }
});

module.exports = router;
