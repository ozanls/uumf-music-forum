const express = require('express');
const router = express.Router();
const { Tag } = require('../models');
const getRandomColor = require('../utilities/GetRandomColor');
const { verifyAuthorization } = require('../utilities/auth');

// Get a tag by id
router.get('/:id', async (req, res) => {
    const tagId = req.params.id;
    try{
        const tag = await Tag.findByPk(tagId);
        res.json(tag);
    }
    catch(error){
        console.error('Error getting tag by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new tag
router.post('/', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tag = req.body;
    tag.hexCode = getRandomColor();
    try{
        await Tag.create(tag);
        res.json(tag);
    }
    catch(error){
        console.error('Error creating tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a tag
router.post('/:id', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tag = req.body;
    const tagId = req.params.id;
    try{
        await Tag.update(tag, { where: { id: tagId } });
        res.json(tag);
    }
    catch(error){
        console.error('Error updating tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete a tag
router.delete('/:id', verifyAuthorization(Tag, 'id', ['admin', 'moderator']), async (req, res) => {
    const tagId = req.params.id;
    try{
        await Tag.destroy({ where: { id: tagId } });
        res.json({ message: 'Tag deleted' });
    }
    catch(error){
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
