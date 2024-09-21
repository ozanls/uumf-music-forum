const express = require('express');
const router = express.Router();
const { Board } = require('../models');

// Get all boards
router.get('/', async (req, res) => {
    const allBoards = await Board.findAll();
    res.json(allBoards);
});

// Get a board by id
router.get('/:id', async (req, res) => {
    const boardId = req.params.id;
    const board = await Board.findByPk(boardId);
    res.json(board);
});

// Create a new board
router.post('/', async (req, res) => {
    const board = req.body;
    await Board.create(board);
    res.json(board);
});

// Update a board
router.post('/:id', async (req, res) => {
    const board = req.body;
    const boardId = req.params.id;
    await Board.update(board, { where: { id: boardId } });
    res.json(board);
});

// Delete a board
router.delete('/:id', async (req, res) => {
    const boardId = req.params.id;
    await Board.destroy({ where: { id: boardId } });
    res.json({ message: 'Board deleted' });
});

module.exports = router;
