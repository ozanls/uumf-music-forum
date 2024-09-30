const express = require('express');
const router = express.Router();
const { Comment, Post, CommentLike } = require('../models');
const { isAuthenticated, verifyAuthorization } = require('../utilities/auth');
const { sequelize } = require('../models');

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
    const post = await Post.findByPk(req.body.postId);
    const transaction = await sequelize.transaction();
    try {
        await Comment.create(comment, { transaction });
        await post.increment('comments', { by: 1, transaction });
        await transaction.commit();
        res.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        await transaction.rollback();
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
    const transaction = await sequelize.transaction();
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Comment not found' });
    }

    const post = await Post.findByPk(comment.postId);

    try {
        await Comment.destroy({ where: { id: commentId }, transaction });
        await post.decrement('comments', { by: 1, transaction });
        await transaction.commit();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        await transaction.rollback();
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Like a comment
router.post('/:id/like', isAuthenticated, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const existingLike = await CommentLike.findOne({ where: { commentId, userId } });
        if (existingLike) {
            await transaction.rollback();
            return res.status(400).json({ message: 'You have already liked this comment' });
        }

        const like = await CommentLike.create({ commentId, userId }, { transaction });
        await Comment.increment('likes', { by: 1, where: { id: commentId }, transaction });
        await transaction.commit();
        res.json(like);

    } catch (error) {
        await transaction.rollback();
        console.error('Error liking comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unlike a comment
router.post('/:id/unlike', isAuthenticated, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const likeDestroyed = await CommentLike.destroy({ where: { commentId, userId }, transaction });

        if (likeDestroyed) {
            await Comment.decrement('likes', { where: { id: commentId }, transaction });
            await transaction.commit();
            res.json({ message: 'Comment unliked' });
        } else {
            await transaction.rollback();
            res.status(404).json({ message: 'Like not found' });
        }

    } catch (error) {
        await transaction.rollback();
        console.error('Error unliking comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
