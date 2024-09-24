const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');
const { hashPassword } = require('../utilities/Hashing');

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
router.get('/auth/status', (req, res) => {
    req.isAuthenticated() ? res.json(req.user) : res.status(401).json({ message: 'Unauthorized' });
});

// Get all users
router.get('/', async (req, res) => {
    const allUsers = await User.findAll();
    res.json(allUsers);
});

// Get a user by id
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    user ? res.json(user) : res.json({ message: 'User not found' });
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
router.post('/:id', async (req, res) => {
    const user = req.body;
    const userId = req.params.id;
    await User.update(user, { where: { id: userId } });
    res.json(user);
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.json({ message: 'User deleted' });
});

module.exports = router;
