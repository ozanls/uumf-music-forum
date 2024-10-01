const express = require('express');
const router = express.Router();
const { Tag } = require('../models');
const getRandomColor = require('../utilities/GetRandomColor');
const { verifyAuthorization } = require('../utilities/auth');

// Get a tag by id
router.get('/:id', async (req, res) => {
    const tagId = req.params.id;
    try {
        const tag = await Tag.findByPk(tagId);
        if (tag) {
            res.status(200).json(tag);
        } else {
            res.status(404).json({ error: 'Tag not found' });
        }
    } catch (error) {
        console.error('Error getting tag by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new tag
router.post('/', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tag = req.body;
    tag.hexCode = getRandomColor();
    try {
        const newTag = await Tag.create(tag);
        res.status(201).json(newTag);
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a tag
router.post('/:id', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tag = req.body;
    const tagId = req.params.id;
    try {
        const [updated] = await Tag.update(tag, { where: { id: tagId } });
        if (updated) {
            const updatedTag = await Tag.findByPk(tagId);
            res.status(200).json(updatedTag);
        } else {
            res.status(404).json({ error: 'Tag not found' });
        }
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a tag
router.delete('/:id', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tagId = req.params.id;
    try {
        const deleted = await Tag.destroy({ where: { id: tagId } });
        if (deleted) {
            res.status(200).json({ message: 'Tag deleted' });
        } else {
            res.status(404).json({ error: 'Tag not found' });
        }
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;