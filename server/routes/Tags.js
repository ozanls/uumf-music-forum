const express = require('express');
const router = express.Router();
const { Tag } = require('../models');
const getRandomColor = require('../utilities/GetRandomColor');

// Get all tags for a specific board
router.get('/:boardId', async (req, res) => {
    const boardId = req.params.boardId;
    const tags = await Tag.findAll({ where: { boardId } });
    res.json(tags);
});

// Get a tag by id
router.get('/:boardId/:id', async (req, res) => {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    res.json(tag);
});

// Create a new tag
router.post('/', async (req, res) => {
    const tag = req.body;
    tag.hexCode = getRandomColor();
    await Tag.create(tag);
    res.json(tag);
});

// Update a tag
router.post('/:id', async (req, res) => {
    const tag = req.body;
    const tagId = req.params.id;
    await Tag.update(tag, { where: { id: tagId } });
    res.json(tag);
});


// Delete a tag
router.delete('/:id', async (req, res) => {
    const tagId = req.params.id;
    await Tag.destroy({ where: { id: tagId } });
    res.json({ message: 'Tag deleted' });
});


module.exports = router;
