const express = require("express");
const { Op } = require("sequelize");
const { Post, Image, User, Comment } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET /posts
  try {
    const where = {};
    if (parseInt(req.query.lastId)) {
      //if not initial loading!
      where.id = { [Op.lt]: parseInt(req.query.lastId) };
    }
    // const posts = await Post.findAll({});
    const posts = await Post.findAll({
      // where: {UserId: 1}
      // offset: 0, //1 ~ 10

      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: Image,
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"], //no password!
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
