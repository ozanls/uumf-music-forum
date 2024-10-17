const express = require("express");
const router = express.Router();
const { Board, Tag, Post, User, sequelize, TrendingTag } = require("../models");
const { verifyAdmin } = require("../utilities/auth");
const updateTrendingTags = require("../utilities/updateTrendingTags");
const { Op } = require("sequelize");
const e = require("express");

// Get all boards
router.get("/", async (req, res) => {
  try {
    const allBoards = await Board.findAll({
      include: [
        {
          model: TrendingTag,
          as: "trendingTags",
          include: [
            {
              model: Tag,
              as: "tag",
              include: [
                {
                  model: Board,
                  as: "board",
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json(allBoards);
  } catch (error) {
    console.error("Error getting all boards:", error);
    res.status(500).json({ error: error.message });
  }
});
// Update trending tags for all boards
router.get("/trendingTags/update", async (req, res) => {
  try {
    const trendingTags = await updateTrendingTags();
    console.log("Trending tags:", trendingTags);
    res.status(200).json(trendingTags);
  } catch (error) {
    console.error("Error updating trending tags:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get trending tags for all boards
router.get("/trendingTags", async (req, res) => {
  try {
    const trendingTags = await TrendingTag.findAll({
      include: [
        {
          model: Tag,
          as: "tag",
          include: [
            {
              model: Board,
              as: "board",
            },
          ],
        },
      ],
    });
    console.log("Trending tags:", trendingTags);
    res.status(200).json(trendingTags);
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get trending tags for a board
router.get("/:id/trendingTags", async (req, res) => {
  const boardId = req.params.id;
  try {
    const trendingTags = await TrendingTag.findAll({
      where: { boardId },
      include: [
        {
          model: Tag,
          as: "tag",
          include: [
            {
              model: Board,
              as: "board",
            },
          ],
        },
      ],
    });
    console.log("Trending tags:", trendingTags);
    res.status(200).json(trendingTags);
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a board by name
router.get("/:name", async (req, res) => {
  const boardName = req.params.name;
  try {
    const board = await Board.findOne({ where: { name: req.params.name } });
    if (board) {
      res.status(200).json(board);
    } else {
      res.status(404).json({ error: "Board not found" });
    }
  } catch (error) {
    console.error("Error getting board by id:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all tags for a board
router.get("/:boardId/tags", async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const allTags = await Tag.findAll({ where: { boardId } });
    res.status(200).json(allTags);
  } catch (error) {
    console.error("Error getting tags for board:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get tags for a board (top 20 by post count in the past week)
router.get("/:boardId/tags/active", async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const topTags = await Tag.sequelize.query(
      `SELECT tags.*, COUNT(posttags.tagId) AS count
       FROM tags
       LEFT JOIN posttags ON tags.id = posttags.tagId
       WHERE tags.boardId = :boardId AND posttags.createdAt >= NOW() - INTERVAL 1 WEEK
       GROUP BY tags.id
       ORDER BY count DESC
       LIMIT 20`,
      {
        replacements: { boardId },
        type: Tag.sequelize.QueryTypes.SELECT,
      }
    );
    res.status(200).json(topTags);
  } catch (error) {
    console.error("Error getting tags for board:", error);
    res.status(500).json({ error: error.message });
  }
});

// Return number of posts in a board
router.get("/:boardId/count", async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const count = await Post.count({ where: { boardId } });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting post count for board:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all posts for a board
router.get("/:boardId/posts", async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const allPosts = await Post.findAll({
      where: { boardId },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    const postsNewFirst = allPosts.reverse();
    res.status(200).json(postsNewFirst);
  } catch (error) {
    console.error("Error getting posts for board:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new board
router.post("/", verifyAdmin(), async (req, res) => {
  const board = req.body;
  if (!board.name || !board.description) {
    res.status(400).json({ error: "Name and description are required" });
    return;
  }
  const existingBoard = await Board.findOne({ where: { name: board.name } });
  if (existingBoard) {
    res.status(400).json({ error: "Board name already exists" });
    return;
  }
  try {
    const newBoard = await Board.create(board);
    res.status(201).json(newBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a board
router.post("/:id", verifyAdmin(), async (req, res) => {
  const board = req.body;
  const boardId = req.params.id;
  try {
    const [updated] = await Board.update(board, { where: { id: boardId } });
    if (updated) {
      const updatedBoard = await Board.findByPk(boardId);
      res.status(200).json(updatedBoard);
    } else {
      res.status(404).json({ error: "Board not found" });
    }
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a board
router.delete("/:id", verifyAdmin(), async (req, res) => {
  const boardId = req.params.id;
  try {
    const deleted = await Board.destroy({ where: { id: boardId } });
    if (deleted) {
      res.status(200).json({ message: "Board deleted" });
    } else {
      res.status(404).json({ error: "Board not found" });
    }
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
