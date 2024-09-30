const express = require('express');
const router = express.Router();
const { Board, Tag, Post, PostXTag, sequelize} = require('../models');
const { verifyAuthorization } = require('../utilities/auth');
const updateTrendingTags = require('../utilities/updateTrendingTags');
const { Op } = require('sequelize');

// Get all boards
router.get('/', async (req, res) => {
    try{
        const allBoards = await Board.findAll();
        res.json(allBoards);
    }
    catch(error){
        console.error('Error getting all boards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trending tags for all boards
router.get('/trendingTags', async (req, res) => {
    try {
        const trendingTags = await updateTrendingTags();
        console.log('Trending tags:', trendingTags);
        res.json(trendingTags);
    } catch (error) {
        console.error('Error updating trending tags:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a board by id
router.get('/:id', async (req, res) => {
    const boardId = req.params.id;
    try{
        const board = await Board.findByPk(boardId);
        res.json(board);
    }
    catch(error){
        console.error('Error getting board by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all tags for a board
router.get('/:boardId/tags', async (req, res) => {
    const boardId = req.params.boardId;
    try{
        const allTags = await Tag.findAll({ where: { boardId } });
        res.json(allTags);
    }
    catch(error){
        console.error('Error getting tags for board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all posts for a board
router.get('/:boardId/posts', async (req, res) => {
    const boardId = req.params.boardId;
    try{
        const allPosts = await Post.findAll({ where: { boardId } });
        res.json(allPosts);
    }
    catch(error){
        console.error('Error getting posts for board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new board
router.post('/', verifyAuthorization(Board, 'id', ['admin']), async (req, res) => {
    const board = req.body;
    try{
        await Board.create(board);
        res.json(board);
    }
    catch(error){
        console.error('Error creating board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a board
router.post('/:id', verifyAuthorization(Board, 'id', ['admin']), async (req, res) => {
    const board = req.body;
    const boardId = req.params.id;
    try{
        await Board.update(board, { where: { id: boardId } });
        res.json(board);
    }
    catch(error){
        console.error('Error updating board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a board
router.delete('/:id', verifyAuthorization(Board, 'id', ['admin']), async (req, res) => {
    const boardId = req.params.id;
    try{
        await Board.destroy({ where: { id: boardId } });
        res.json({ message: 'Board deleted' });
    }
    catch(error){
        console.error('Error deleting board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
