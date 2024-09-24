const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');


// Authenticate a user (login)
router.post('/auth', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

// Un-authenticate a user (logout)
router.post('/auth/logout', (req, res) => {
    !req.user ? res.status(401).json({ message: 'Unauthorized' }) : req.logout((err) => {
        if (err) {
            res.status(500).json({ message: 'Server error' });
        } else {
            res.status(200).json({ message: 'Logout Successful' });
        }
    });

});

// Authentication status
router.get('/auth/status', (req, res) => {
    console.log('inside auth status');
    console.log(req.user);
    console.log(req.session);
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
    res.json(user);
});

// Create a new user
router.post('/', async (req, res) => {
    const user = req.body;
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
