const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const { isAuthenticated, verifyAuthorization } = require('../utilities/auth');

// Get a comment by id
router.get('/:id', async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);
    res.json(comment);
});

// Create a new comment
router.post('/', isAuthenticated, async (req, res) => {
    const comment = req.body;
    await Comment.create(comment);
    res.json(comment);
});

// Update a comment
router.post('/:id', verifyAuthorization(Comment, 'id', ['admin', 'moderator']), async (req, res) => {
    const comment = req.body;
    const commentId = req.params.id;
    await Comment.update(comment, { where: { id: commentId } });
    res.json(comment);
});

// Delete a comment
router.delete('/:id', verifyAuthorization(Comment, 'id', ['admin', 'moderator']), async (req, res) => {
    const commentId = req.params.id;
    await Comment.destroy({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
});

module.exports = router;
