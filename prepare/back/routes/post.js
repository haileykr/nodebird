const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const { isLoggedIn } = require("./middlewares");
const { Post, User, Comment, Image, Hashtag } = require("../models");

const router = express.Router();

try {
  fs.accessSync("uploads"); //check if there is an "uploads"folder already
} catch (error) {
  console.log("Creating uploads folder");
  fs.mkdirSync("uploads");
}

// AWS.config.update({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: 'us-east-2',
// });
// STORAGE ON BACKEND SERVER (W/O USING AWS)
const upload = multer({
  storage: multer.diskStorage({
    //on disk for now
    destination(req, file, done) {
      done(null, "uploads"); //"uploads"folder
    },
    filename(req, file, done) {
      // ex. photo.png
      const ext = path.extname(file.originalname); //ex. png
      const basename = path.basename(file.originalname, ext); //ex. photo

      done(null, basename + "_" + new Date().getTime() + ext); //ex. photo153741923.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20MB
});

// const upload = multer({
//   storage: multerS3({
//     s3: new AWS.S3(),
//     bucket: 'babbleheehaw',
//     key(req, file, cb){//storage name
//       cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
//     }
//   })
// });

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );

      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // if multiple images are uploaded : [a.png, b.png] array is sent
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        ); //sequelize create

        // inside the parentheses, each one is a Promise
        // images are saved in the server, and only the filenames are saved in the database
        await post.addImages(images);
      } else {
        //if a single image is uploaded: a.png string is sent
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, //Comment Author
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, //Post Author

          attributes: ["id", "nickname"],
        },
        {
          model: User, //Likers
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    //upload.array for multiple images, upload.single for a single image
    //upload.none() for json/text only

    //this portion is ran once logged in, and the files are uploaded
    // res.json(req.files.map((v) => v.filename));
    res.json(req.files.map((v) => v.location));//with AWS S3
  }
);

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // POST /post/1/comment
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("Post does not exist.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      UserId: req.user.id,
      PostId: parseInt(req.params.postId),
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  //PATCH /post/1/like
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("The post does not exist.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/unlike", isLoggedIn, async (req, res, next) => {
  //PATCH /post/1/unlike
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("The post does not exist.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res) => {
  //DELETE /post
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:postId", async (req, res, next) => {
  //GET /post/1
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("The post does not exist.");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: Image,
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    console.log(fullPost);
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet", //post.Retweet Available!
        },
      ],
    });
    if (!post) {
      return res.status(403).send("The post does not exist.");
    }
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("You cannot retweet your own post.");
    }
    const retweetTargetId = post.RetweetId || post.id; //if the post we're retweeting retweeted another post, refer to the original post id!
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("You already retweeted this post.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
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
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: Image,
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });

    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
