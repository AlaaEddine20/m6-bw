const express = require("express");
const { Op } = require("sequelize");
const Like = require("../../utilities/db").Like;
const User = require("../../utilities/db").User;
const Post = require("../../utilities/db").Post;
// ROUTER
const router = express.Router();

// show if user liked a post and how many likes a post has
router.get("/:postId/:userId", async (req, res, next) => {
  const totalLikes = await Like.count({ where: { postId: req.params.postId } });
  let isLiked = false;
  const like = await Like.findOne({
    where: {
      postId: req.params.postId,
      userId: req.params.userId,
    },
  });

  if (like) isLiked = true;
  res.send({ total: totalLikes, isLiked });
});

// user can like and dislike a specific post
router.post("/:postId/:userId", async (req, res) => {
  try {
    const like = await Like.findOne({
      where: {
        postId: req.params.postId,
        userId: req.params.userId,
      },
    });

    if (!like) {
      const newLike = await Like.create({
        postId: req.params.postId,
        userId: req.params.userId,
      });
      res.send(newLike);
    } else {
      await Like.destroy({
        where: { postId: req.params.postId, userId: req.params.userId },
      });
      res.send("deleted");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
