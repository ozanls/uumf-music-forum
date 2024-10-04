const express = require('express');
const router = express.Router();
const { Board, Tag, Post, User, PostTag, sequelize, TrendingTag } = require('../models');
const { verifyAuthorization } = require('../utilities/auth');
const updateTrendingTags = require('../utilities/updateTrendingTags');
const { Op } = require('sequelize');

// Get all boards
router.get('/', async (req, res) => {
    try {
        const allBoards = await Board.findAll();
        res.status(200).json(allBoards);
    } catch (error) {
        console.error('Error getting all boards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trending tags for all boards
router.get('/trendingTags', async (req, res) => {
    try {
        const trendingTags = await updateTrendingTags();
        console.log('Trending tags:', trendingTags);
        res.status(200).json(trendingTags);
    } catch (error) {
        console.error('Error updating trending tags:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trending tags for a board
router.get('/:id/trendingTags', async (req, res) => {
    const boardId = req.params.id;
    try {
        const trendingTags = await TrendingTag.findAll({
            where: { boardId },
            include: [{ model: Tag, as: 'tag' }]
        });
        console.log('Trending tags:', trendingTags);
        res.status(200).json(trendingTags);
    } catch (error) {
        console.error('Error fetching trending tags:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a board by name
router.get('/:name', async (req, res) => {
    const boardName = req.params.name;
    try {
        const board = await Board.findOne({ where: { name: req.params.name } });
        if (board) {
            res.status(200).json(board);
        } else {
            res.status(404).json({ error: 'Board not found' });
        }
    } catch (error) {
        console.error('Error getting board by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all tags for a board
router.get('/:boardId/tags', async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const allTags = await Tag.findAll({ where: { boardId } });
        res.status(200).json(allTags);
    } catch (error) {
        console.error('Error getting tags for board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all posts for a board
router.get('/:boardId/posts', async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const allPosts = await Post.findAll({ 
            where: { boardId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }]
        });

        const postsNewFirst = allPosts.reverse();
        res.status(200).json(postsNewFirst);
    } catch (error) {
        console.error('Error getting posts for board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new board
router.post('/', verifyAuthorization(Board, 'id', ['admin']), async (req, res) => {
    const board = req.body;
    try {
        const newBoard = await Board.create(board);
        res.status(201).json(newBoard);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a board
router.post('/:id', verifyAuthorization(Board, 'id', ['admin']), async (req, res) => {
    const board = req.body;
    const boardId = req.params.id;
    try {
        const [updated] = await Board.update(board, { where: { id: boardId } });
        if (updated) {
            const updatedBoard = await Board.findByPk(boardId);
            res.status(200).json(updatedBoard);
        } else {
            res.status(404).json({ error: 'Board not found' });
        }
    } catch (error) {
        console.error('Error updating board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a board
router.delete('/:id', verifyAuthorization(Board, 'id', ['admin']), async (req, res) => {
    const boardId = req.params.id;
    try {
        const deleted = await Board.destroy({ where: { id: boardId } });
        if (deleted) {
            res.status(200).json({ message: 'Board deleted' });
        } else {
            res.status(404).json({ error: 'Board not found' });
        }
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;