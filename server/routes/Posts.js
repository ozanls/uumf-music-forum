const express = require("express");
const router = express.Router();
const {
  Post,
  Comment,
  Tag,
  PostTag,
  PostLike,
  Save,
  User,
  Board,
  sequelize,
} = require("../models");
const getRandomColor = require("../utilities/GetRandomColor");
const {
  isAuthenticated,
  verifyAuthorization,
  isOwner,
} = require("../utilities/auth");
const { Op } = require("sequelize");

// Get all posts
router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.findAll();
    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Error getting all posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a post by id
router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error getting post by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all comments for a post
router.get("/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments for post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all tags for a post
router.get("/:postId/tags", async (req, res) => {
  const postId = req.params.postId;
  try {
    const postTags = await PostTag.findAll({
      where: { postId },
      include: [
        {
          model: Tag,
          as: "tag",
        },
      ],
    });
    res.status(200).json(postTags);
  } catch (error) {
    console.error("Error getting tags for post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new post
router.post("/", isAuthenticated, async (req, res) => {
  const post = req.body;
  req.body.userId = req.user.id;
  req.body.likes = 0;
  req.body.status = "active";

  try {
    const newPost = await Post.create(post);
    const postTags = post.tags;

    for (const tag of postTags) {
      const [newTag] = await Tag.findOrCreate({
        where: { boardId: newPost.boardId, name: tag },
        defaults: { hexCode: getRandomColor() },
      });

      await PostTag.create({ postId: newPost.id, tagId: newTag.id });
    }
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a post
router.post(
  "/:id",
  verifyAuthorization(Post, "id", ["admin", "moderator"]),
  async (req, res) => {
    const post = req.body;
    const postId = req.params.id;

    try {
      await Post.update(post, { where: { id: postId } });
      const postTags = post.tags;

      if (postTags) {
        await PostTag.destroy({ where: { postId: postId } });

        for (const tag of postTags) {
          const [newTag] = await Tag.findOrCreate({
            where: { boardId: post.boardId, name: tag },
            defaults: { hexCode: getRandomColor() },
          });

          await PostTag.create({ postId: postId, tagId: newTag.id });
        }
      }

      res.status(200).json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Like or unlike a post
router.post("/:id/like", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const transaction = await sequelize.transaction();

  try {
    const existingLike = await PostLike.findOne({ where: { postId, userId } });
    if (existingLike) {
      await PostLike.destroy({ where: { postId, userId }, transaction });
      await Post.decrement("likes", { where: { id: postId }, transaction });
      await transaction.commit();
      return res.status(200).json({ message: "Post unliked" });
    } else {
      const like = await PostLike.create({ postId, userId }, { transaction });
      await Post.increment("likes", {
        by: 1,
        where: { id: postId },
        transaction,
      });
      await transaction.commit();
      return res.status(200).json({ message: "Post liked", like });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if a post is liked by the user
router.get("/:id/liked", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const like = await PostLike.findOne({ where: { postId, userId } });
    if (like) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save a post
router.post("/:id/save", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const transaction = await sequelize.transaction();

  try {
    const existingSave = await Save.findOne({ where: { postId, userId } });
    if (existingSave) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "You have already saved this post" });
    }

    const save = await Save.create({ postId, userId }, { transaction });
    await transaction.commit();
    res.status(201).json(save);
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Unsave a post
router.post("/:id/unsave", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const transaction = await sequelize.transaction();

  try {
    const saveDestroyed = await Save.destroy({
      where: { postId, userId },
      transaction,
    });

    if (saveDestroyed) {
      await transaction.commit();
      res.status(200).json({ message: "Post unsaved" });
    } else {
      await transaction.rollback();
      res.status(404).json({ message: "Save not found" });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error unsaving post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search for posts within a board
router.get("/search/:boardName/:query", async (req, res) => {
  const boardName = req.params.boardName;
  const query = req.params.query;

  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Board,
          as: "board",
          where: {
            name: boardName,
          },
          attributes: [],
        },
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            body: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });

    if (posts.length === 0) {
      res.status(200).json({ message: "No posts found" });
      return;
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching for posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a post
router.delete(
  "/:id",
  verifyAuthorization(Post, "id", ["admin", "moderator"]),
  async (req, res) => {
    const postId = req.params.id;
    try {
      await Post.destroy({ where: { id: postId } });
      res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
