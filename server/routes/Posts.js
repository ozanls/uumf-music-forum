const express = require('express');
const router = express.Router();
const { Post, Comment, Tag, PostXTag } = require('../models');
const getRandomColor = require('../utilities/GetRandomColor');

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

// Get all comments for a post
router.get('/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    const allComments = await Comment.findAll({ where: { postId } });
    res.json(allComments);
});

// Create a new post
router.post('/', async (req, res) => {
    const post = req.body;
    try {
        const newPost = await Post.create(post); 
        const postTags = post.tags;

        // Add tags
        for (const tag of postTags) {
            const [newTag] = await Tag.findOrCreate({ 
                where: { boardId: newPost.boardId, name: tag },
                defaults: { hexCode: getRandomColor()}
            });

            // Create PostsXTags entry
            await PostXTag.create({ postId: newPost.id, tagId: newTag.id });
        }
        res.json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a post
router.post('/:id', async (req, res) => {
    const post = req.body;
    const postId = req.params.id;
    try {
        await Post.update(post, { where: { id: postId } });

        // Update tags
        const postTags = post.tags;
        if (postTags) {

            // Remove existing tags
            await PostXTag.destroy({ where: { postId: postId } });

            // Add new tags
            for (const tag of postTags) {
                const [newTag] = await Tag.findOrCreate({
                    where: { boardId: post.boardId, name: tag },
                    defaults: { hexCode: getRandomColor() }
                });

                await PostXTag.create({ postId: postId, tagId: newTag.id });
            }
        }

        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const postId = req.params.id;
    await Post.destroy({ where: { id: postId } });
    res.json({ message: 'Post deleted' });
});

module.exports = router;
