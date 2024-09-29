const express = require('express');
const router = express.Router();
const { Post, Comment, Tag, PostXTag, Like, Save, sequelize } = require('../models');
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

        for (const tag of postTags) {
            const [newTag] = await Tag.findOrCreate({ 
                where: { boardId: newPost.boardId, name: tag },
                defaults: { hexCode: getRandomColor()}
            });

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
        const postTags = post.tags;

        if (postTags) {
            await PostXTag.destroy({ where: { postId: postId } });
            
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
    const transaction = await sequelize.transaction();

    try {
        const existingLike = await Like.findOne({ where: { postId, userId } });
        if (existingLike) {
            await transaction.rollback();
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        const like = await Like.create({ postId, userId }, { transaction });
        await Post.increment('likes', { by: 1, where: { id: postId }, transaction });
        await transaction.commit();
        res.json(like);

    } catch (error) {
        await transaction.rollback();
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unlike a post
router.post('/:id/unlike', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const likeDestroyed = await Like.destroy({ where: { postId, userId }, transaction });

        if (likeDestroyed) {
            await Post.decrement('likes', { where: { id: postId }, transaction });
            await transaction.commit();
            res.json({ message: 'Post unliked' });
        } else {
            await transaction.rollback();
            res.status(404).json({ message: 'Like not found' });
        }

    } catch (error) {
        await transaction.rollback();
        console.error('Error unliking post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save a post
router.post('/:id/save', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const existingSave = await Save.findOne({ where: { postId, userId } });
        if (existingSave) {
            await transaction.rollback();
            return res.status(400).json({ message: 'You have already saved this post' });
        }

        const save = await Save.create({ postId, userId }, { transaction });
        await transaction.commit();
        res.json(save);
    } catch (error) {
        await transaction.rollback();
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unsave a post
router.post('/:id/unsave', isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const saveDestroyed = await Save.destroy({
            where: { postId, userId }, transaction
        });

        if (saveDestroyed) {
            await transaction.commit();
            res.json({ message: 'Post unsaved' });
        } else {
            await transaction.rollback();
            res.status(404).json({ message: 'Save not found' });
        }

    } catch (error) {
        await transaction.rollback();
        console.error('Error unsaving post:', error);
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
    try{
        await Post.destroy({ where: { id: postId } });
        res.json({ message: 'Post deleted' });
    }
    catch(error){
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
