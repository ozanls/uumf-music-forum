const express = require("express");
const router = express.Router();
const { Comment, Post, CommentLike } = require("../models");
const { isAuthenticated, verifyAuthorization } = require("../utilities/auth");
const { sequelize } = require("../models");
const axios = require("axios");
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Get a comment by id
router.get("/:id", async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await Comment.findByPk(commentId);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error getting comment by id:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new comment
router.post("/:id", isAuthenticated, async (req, res) => {
  const comment = req.body;
  req.body.userId = req.user.id;
  req.body.likes = 0;
  req.body.status = "active";
  const postId = req.params.id;
  const post = await Post.findByPk(postId);
  const transaction = await sequelize.transaction();

  const recaptchaToken = req.body.recaptchaToken;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token is missing" });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    const { success, "error-codes": errorCodes } = response.data;

    if (!success) {
      return res
        .status(400)
        .json({ error: "reCAPTCHA verification failed", errorCodes });
    }

    if (!req.body.body) {
      await transaction.rollback();
      return res.status(400).json({ error: "Comment body is required" });
    }

    try {
      await Comment.create({ ...comment, postId }, { transaction });
      await post.increment("comments", { by: 1, transaction, silent: true });
      await transaction.commit();
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a comment
router.post(
  "/:id/update",
  verifyAuthorization(Comment, "id", ["admin", "moderator"]),
  async (req, res) => {
    const commentId = req.params.id;
    const updatedComment = { body: req.body.body };

    try {
      await Comment.update(updatedComment, { where: { id: commentId } });
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete a comment
router.delete(
  "/:id",
  verifyAuthorization(Comment, "id", ["admin", "moderator"]),
  async (req, res) => {
    const commentId = req.params.id;
    const transaction = await sequelize.transaction();
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      await transaction.rollback();
      return res.status(404).json({ error: "Comment not found" });
    }

    const post = await Post.findByPk(comment.postId);

    try {
      await Comment.destroy({ where: { id: commentId }, transaction });
      await post.decrement("comments", { by: 1, transaction, silent: true });
      await transaction.commit();
      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }
);

// Like or unlike a comment
router.post("/:id/like", isAuthenticated, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const transaction = await sequelize.transaction();

  try {
    const existingLike = await CommentLike.findOne({
      where: { commentId, userId },
    });
    if (existingLike) {
      await CommentLike.destroy({ where: { commentId, userId }, transaction });
      await Comment.decrement("likes", {
        where: { id: commentId },
        transaction,
        silent: true,
      });
      await transaction.commit();
      return res.status(200).json({ message: "Comment unliked" });
    } else {
      const like = await CommentLike.create(
        { commentId, userId },
        { transaction }
      );
      await Comment.increment("likes", {
        by: 1,
        where: { id: commentId },
        transaction,
        silent: true,
      });
      await transaction.commit();
      return res.status(201).json({ message: "Comment liked", like });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error liking comment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check if a comment is liked by the user
router.get("/:id/liked", isAuthenticated, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const like = await CommentLike.findOne({ where: { commentId, userId } });
    if (like) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (error) {
    console.error("Error checking if comment is liked:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
