const express = require('express');
const router = express.Router();
const { Post } = require('../models');

// Get all posts
router.get('/', async (req, res) => {
    const allPosts = await Post.findAll();
    res.json(allPosts);
});

// Get a post by id
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    res.json(post);
});

// Create a new post
router.post('/', async (req, res) => {
    const post = req.body;
    await Post.create(post);
    res.json(post);
});

// Update a post
router.post('/:id', async (req, res) => {
    const post = req.body;
    const postId = req.params.id;
    await Post.update(post, { where: { id: postId } });
    res.json(post);
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const postId = req.params.id;
    await Post.destroy({ where: { id: postId } });
    res.json({ message: 'Post deleted' });
});

module.exports = router;
