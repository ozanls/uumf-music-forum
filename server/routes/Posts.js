const express = require('express');
const router = express.Router();
const { Post, Comment, Tag, PostXTag, Like, Save } = require('../models');
const getRandomColor = require('../utilities/GetRandomColor');
const { isAuthenticated, verifyAuthorization , isOwner } = require('../utilities/auth');
const { Op } = require('sequelize');

// Get all posts
router.get('/', async (req, res) => {
    try{
        const allPosts = await Post.findAll();
        res.json(allPosts);
    }
    catch(error){
        console.error('Error getting all posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a post by id
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    try{
        const post = await Post.findByPk(postId);
        res.json(post);
    }
    catch(error){
        console.error('Error getting post by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all comments for a post
router.get('/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    try{
        const allComments = await Comment.findAll({ where: { postId } });
        res.json(allComments);
    }
    catch(error){
        console.error('Error getting comments for post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new post
router.post('/', isAuthenticated, async (req, res) => {
    const post = req.body;
    req.body.userId = req.user.id;

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
router.post('/:id', verifyAuthorization(Post, 'id', ['admin', 'moderator']), async (req, res) => {
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

// Like a post
router.post('/:id/like', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const like = await Like.create({ postId, userId });
        // Increment the likes attribute of the post
        await Post.increment('likes', { where: { id: postId } });
        res.json(like);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unlike a post
router.post('/:id/unlike', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        await Like.destroy({ where: { postId, userId } });
        // Decrement the likes attribute of the post
        await Post.decrement('likes', { where: { id: postId } });
        res.json({ message: 'Post unliked' });

    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save a post
router.post('/:id/save', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const save = await Save.create({ postId, userId });
        res.json(save);
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unsave a post
router.post('/:id/unsave', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        // Destroy the save entry
        const save = await Save.destroy({
            where: { postId, userId }
        });

        res.json({ message: 'Post unsaved', save });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search for posts within a board
router.get('/search/:boardId/:query', async (req, res) => {
    const boardId = req.params.boardId;
    const query = req.params.query;

    try {
        const posts = await Post.findAll({
            where: {
                boardId,
                title: {
                    [Op.like]: `%${query}%`
                }
            }
        });

        if (posts.length === 0) {
            res.json({ message: 'No posts found' });
            return;
        }
        
        res.json(posts);
    } catch (error) {
        console.error('Error searching for posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
router.delete('/:id', verifyAuthorization(Post, 'id', ['admin', 'moderator']), async (req, res) => {
    const postId = req.params.id;
    await Post.destroy({ where: { id: postId } });
    res.json({ message: 'Post deleted' });
});

module.exports = router;
