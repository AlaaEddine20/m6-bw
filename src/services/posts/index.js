const express = require("express");
const multer = require("multer");
const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Post = require("../../utilities/db").Post;

const Comment = require("../../utilities/db").Comment;
const User = require("../../utilities/db").User;

const verify = require("../auth/verifyToken");

// router
const router = express.Router();
// Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
  },
});
const cloudinaryStorage = multer({
  storage: storage,
});

// ADD NEW POST

router.post("/", cloudinaryStorage.array("image", 2),verify, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      image: req.files[0].path,
      userId: req.user._id,
    });
    res.status(201).send(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });

  }
);

// GET ALL POSTS with likes
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({include: [{
      model: Comment},
      {model: User,
      attributes: ['username', 'image']}
    ]});
    res.send(posts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get a specific post with likes
router.get("/:id", async (req, res) => {
  try {
    const requestedPost = await Post.findOne({
      where: { _id: req.params.id },
    });
    res.send(requestedPost);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Modify a post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.update(req.body, {
      where: { _id: req.params.id },
      returning: true,
      plain: true,
    });
    res.send(updatedPost[1]);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    await Post.destroy({ where: { _id: req.params.id } }).then((deleted) => {
      if (deleted === 1) res.send("Deleted!");
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
