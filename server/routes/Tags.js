const express = require('express');
const router = express.Router();
const { Tag } = require('../models');
const getRandomColor = require('../utilities/GetRandomColor');
const { verifyAuthorization } = require('../utilities/auth');

// Get a tag by id
router.get('/:id', async (req, res) => {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    res.json(tag);
});

// Create a new tag
router.post('/', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tag = req.body;
    tag.hexCode = getRandomColor();
    await Tag.create(tag);
    res.json(tag);
});

// Update a tag
router.post('/:id', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tag = req.body;
    const tagId = req.params.id;
    await Tag.update(tag, { where: { id: tagId } });
    res.json(tag);
});


// Delete a tag
router.delete('/:id', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tagId = req.params.id;
    await Tag.destroy({ where: { id: tagId } });
    res.json({ message: 'Tag deleted' });
});


module.exports = router;
