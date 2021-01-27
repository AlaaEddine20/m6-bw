const express = require("express");
const { Op } = require("sequelize");
const Like = require("../../utilities/db").Like;
const User = require("../../utilities/db").User;
const Post = require("../../utilities/db").Post;
// ROUTER
const router = express.Router();

/* get /:postId   
await Like.count({where:{postID:req.params.postId}}) 
check if this specific user liked this specific post
if liked?  isliked:true else isLiked
*/
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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

/*res.send({likes:totalCount, isLiked:true/false
})
*/

/**
 * post /:postId/:userId
 *
 * ..check id user liked this post before
 * if liked ? delete
 * else create
 */

module.exports = router;
