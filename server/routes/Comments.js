const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const { isAuthenticated, verifyAuthorization } = require('../utilities/auth');

// Get a comment by id
router.get('/:id', async (req, res) => {
    const commentId = req.params.id;
    try{
        const comment = await Comment.findByPk(commentId);
        res.json(comment);
    }
    catch(error){
        console.error('Error getting comment by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new comment
router.post('/', isAuthenticated, async (req, res) => {
    const comment = req.body;
    try{
        await Comment.create(comment);
        res.json(comment);
    }
    catch(error){
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a comment
router.post('/:id', verifyAuthorization(Comment, 'id', ['admin', 'moderator']), async (req, res) => {
    const comment = req.body;
    const commentId = req.params.id;
    try{
        await Comment.update(comment, { where: { id: commentId } });
        res.json(comment);
    }
    catch(error){
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a comment
router.delete('/:id', verifyAuthorization(Comment, 'id', ['admin', 'moderator']), async (req, res) => {
    const commentId = req.params.id;
    try{
        await Comment.destroy({ where: { id: commentId } });
        res.json({ message: 'Comment deleted' });
    }
    catch(error){
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
