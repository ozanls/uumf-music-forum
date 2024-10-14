const express = require("express");
const router = express.Router();
const { Tag, PostTag, Post, User, Board } = require("../models");
const getRandomColor = require("../utilities/GetRandomColor");
const { verifyAuthorization } = require("../utilities/auth");

// Get a tag by board and name
router.get("/find/:boardName/:tagName", async (req, res) => {
  const { boardName, tagName } = req.params;
  try {
    const board = await Board.findOne({ where: { name: boardName } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const tag = await Tag.findOne({
      where: { name: tagName, boardId: board.id },
    });
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({ error: "Tag not found" });
    }
  } catch (error) {
    console.error("Error getting tag by name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new tag
router.post(
  "/",
  verifyAuthorization(Tag, "id", ["admin", "moderator"]),
  async (req, res) => {
    const tag = req.body;
    tag.hexCode = getRandomColor();
    try {
      const newTag = await Tag.create(tag);
      res.status(201).json(newTag);
    } catch (error) {
      console.error("Error creating tag:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update a tag
router.post(
  "/:id",
  verifyAuthorization(Tag, "id", ["admin", "moderator"]),
  async (req, res) => {
    const tag = req.body;
    const tagId = req.params.id;
    try {
      const [updated] = await Tag.update(tag, { where: { id: tagId } });
      if (updated) {
        const updatedTag = await Tag.findByPk(tagId);
        res.status(200).json(updatedTag);
      } else {
        res.status(404).json({ error: "Tag not found" });
      }
    } catch (error) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a tag
router.delete(
  "/:id",
  verifyAuthorization(Tag, "id", ["admin", "moderator"]),
  async (req, res) => {
    const tagId = req.params.id;
    try {
      const deleted = await Tag.destroy({ where: { id: tagId } });
      if (deleted) {
        res.status(200).json({ message: "Tag deleted" });
      } else {
        res.status(404).json({ error: "Tag not found" });
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Return all posts for a tag
router.get("/posts/:id", async (req, res) => {
  const tagId = req.params.id;
  try {
    const posts = await PostTag.findAll({
      where: { tagId },
      include: [
        {
          model: Post,
          as: "post",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    if (posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this tag" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts for tag:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Return number of entries for a tag by tag name
router.get("/count/:id", async (req, res) => {
  const tagId = req.params.id;
  try {
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const count = await PostTag.count({ where: { tagId: tag.id } });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting tag count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
