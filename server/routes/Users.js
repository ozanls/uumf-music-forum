const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User, Save, Post } = require('../models');
const { hashPassword } = require('../utilities/hashing');
const { isAuthenticated, verifyAuthorization } = require('../utilities/auth');
const sendConfirmationEmail = require('../utilities/sendConfirmationEmail');
const sendForgotPasswordEmail = require('../utilities/sendForgotPasswordEmail');
const deleteUnconfirmedUsers = require('../utilities/deleteUnconfirmedUsers');
require('dotenv').config();


// Authenticate a user (login)
router.post('/auth', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username/password' });
        }
        if (!user.confirmedEmail) {
            return res.status(401).json({ message: 'Please confirm your email address' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            return res.status(200).json({ message: 'Login successful' });
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
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error('Error getting authentication status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users
router.get('/', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    try{
        const allUsers = await User.findAll();
        res.status(200).json(allUsers);
    }
    catch(error){
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all saved posts for a user
router.get('/saved', isAuthenticated, async (req, res) => {
    const userId = req.user.id;

    try {
        const saves = await Save.findAll({
            where: { userId },
            include: [{
                model: Post,
                as: 'post'
            }]
        });

        res.status(200).json(saves);
    } catch (error) {
        console.error('Error getting saved posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a user by id
router.get('/:id', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findByPk(userId);
        user ? res.status(200).json(user) : res.status(404).json({ message: 'User not found' });
    }
    catch(error){
        console.error('Error getting user by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
// Create a new user (register)
router.post('/register', async (req, res) => {
    
    if (!req.body.username || !req.body.email) {
        res.status(400).json({ message: 'Username and email are required' });
        return;
    }

    if (req.body.password !== req.body.confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
        return;
    }

    if (req.body.agreedToTerms !== true) {
        res.status(400).json({ message: 'You must agree to the terms and conditions' });
        return;
    }

    const user = req.body;
    user.password = await hashPassword(user.password);
    user.role = 'user'; // Default role
    user.image = 'https://placehold.co/500x500' // Default image
    const existingUser = await User.findOne({ where: { username: user.username } });
    const existingEmail = await User.findOne({ where: { email: user.email } });
    
    if (existingUser) {
        res.status(400).json({ message: 'Username is taken' });
        return;
    }

    if (existingEmail) {
        res.status(400).json({ message: 'Email already in use' });
        return;
    }

    const newUser = await User.create(user);
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    sendConfirmationEmail(newUser, token);
    res.status(201).json(newUser);
});

// Confirm email route
router.get('/confirm/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.confirmedEmail = true;
        await user.save();

        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        console.error('Error confirming email:', error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await sendForgotPasswordEmail(user, token);
        }
        res.status(200).json({ message: 'If an account with that email exists, you\'ll receive a password reset email shortly...' });
    } catch (error) {
        console.error('Error in forgot-password route:', error);
        res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
    }
});

// Reset password route (from forgot password email)
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Password fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Update own email
router.post('/update/email', isAuthenticated, async (req, res) => {
    const { email } = req.body;
    const userId = req.user.id;

    if (!email) {
        return res.status(400).json({ error: 'Email field is required, please try again' });
    }
    
    try {
        const [updatedRows] = await User.update({ email }, { where: { id: userId } });
        
        if (updatedRows === 0) {
            return res.status(400).json({ error: 'Email update failed' });
        }

        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update own password (authenticated user)
router.post('/update/password', isAuthenticated, async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Password fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await hashPassword(newPassword);
        await User.update({ password: hashedPassword }, { where: { id: userId } });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a user
router.post('/:id', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    const user = req.body;
    const userId = req.params.id;
    try{
        await User.update(user, { where: { id: userId } });
        res.status(200).json(user);
    }
    catch(error){
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete all accounts over 1hr old with unconfirmed emails
router.delete('/delete-unconfirmed', verifyAuthorization(User, 'id', ['admin']), async (req, res) => {
    try {
        await deleteUnconfirmedUsers();
        res.status(200).json({ message: 'Unconfirmed accounts deleted' });
    } catch (error) {
        console.error('Error deleting unconfirmed accounts:', error);
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
