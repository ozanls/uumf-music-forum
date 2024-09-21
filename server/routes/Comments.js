const express = require('express');
const router = express.Router();
const { Comment } = require('../models');

// Get all comments for a specific post
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const allComments = await Comment.findAll({ where: { postId } });
    res.json(allComments);
});

// Get a comment by id
router.get('/:postId/:id', async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);
    res.json(comment);
});

// Create a new comment
router.post('/', async (req, res) => {
    const comment = req.body;
    await Comment.create(comment);
    res.json(comment);
});

// Update a comment
router.post('/:id', async (req, res) => {
    const comment = req.body;
    const commentId = req.params.id;
    await Comment.update(comment, { where: { id: commentId } });
    res.json(comment);
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    const commentId = req.params.id;
    await Comment.destroy({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
});

module.exports = router;
