const express = require("express");
const { Post, Image, Comment, User, Hashtag } = require("../models");

const { Op } = require("sequelize");

const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  // GET /hashtag/sample
  try {
    const where = {};
    if (parseInt(req.query.lastId)) {
      //if not initial loading!
      where.id = { [Op.lt]: parseInt(req.query.lastId) };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
        },
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
