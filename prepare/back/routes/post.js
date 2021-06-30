const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { isLoggedIn } = require("./middlewares");
const { Post, User, Comment, Image } = require("../models");

const router = express.Router();

try {
  fs.accessSync ("uploads"); //check if there is an "uploads"folder already
} catch (error) {
  console.log("Creating uploads folder");
  fs.mkdirSync("uploads");
}

router.post("/", isLoggedIn, async (req, res, next) => {
  // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
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
          as: 'Likers',
          attributes: ['id', 'nickname'],
        }
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error); 
  }
});

const upload = multer({
  storage: multer.diskStorage({ //on disk for now
    destination(req, file, done) {
      done(null, 'uploads'); //"uploads"folder
    },
    filename(req, file, done){// ex. photo.png
      const ext = path.extname(file.originalname); //ex. png
      const basename = path.basename(file.originalname, ext);//ex. photo

      done(null, basename + new Date().getTime()+ ext); //ex. photo153741923.png
    }
  }),
  limits: {fileSize: 20 * 1024 * 1024 }, //20MB
});
router.post("/images", isLoggedIn, upload.array('image'), async (req, res, next) => {
//upload.array for multiple images, upload.single for a single image
//upload.none() for json/text only

//this portion is ran once logged in, and the files are uploaded
console.log(req.files); //file info shown
res.json(req.files.map((v) => v.filename));
})

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

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => { //PATCH /post/1/like
  try {
    const post = await Post.findOne({
      where: {id: req.params.postId}
    });
    if (!post) {
      return res.status(403).send("The post does not exist.");
    }
    await post.addLikers(req.user.id);
    res.json({PostId: post.id,UserId:req.user.id});
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.delete("/:postId/unlike", isLoggedIn, async (req, res, next) => { //PATCH /post/1/unlike
  try {
    const post = await Post.findOne({
      where: {id: req.params.postId}
      });
      if (!post) {
        return res.status(403).send("The post does not exist.");
      }
      await post.removeLikers(req.user.id);
      res.json({PostId: post.id, UserId: req.user.id});
} catch(error){
  console.error(error);
  next(error);
}
})
  


router.delete("/:postId", isLoggedIn, async (req, res) => { //DELETE /post
  try{
    await Post.destroy({
      where: {
        id: req.params.postId,
      UserId: req.user.id}})
    res.status(200).json({PostId:parseInt(req.params.postId)}); 
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
