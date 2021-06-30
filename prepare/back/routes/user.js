const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require("../models"); // index.js에서 db에 User가 담겨 exports되어 접근 가능해 짐!
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET /user
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes:
          // ['id', 'nickname', 'email'],
          {
            exclude: ["password"],
          },
        include: [
          {
            model: Post,
            attributes: ["id"], //to get only the data needed to show numbers
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",

            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword); //user info
    } else {
      res.status(200).json(null); //if logged out
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  //middleware expansion format!
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      //server error
      console.error(error);
      return next(error);
    }
    if (info) {
      //client error
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginError) => {
      //passport login
      if (loginError) {
        //if error during passportlogin
        console.error(loginError);
        return next(loginError);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes:
          // ['id', 'nickname', 'email'],
          {
            exclude: ["password"],
          },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword); //user info
    });
  })(req, res, next);
}); //POST /user/login

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId }}); //confirm that the user exists!
    if (!user) {
      res.status(403).send("The user does not exist.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); //confirm that the user exists!
    if (!user) {
      res.status(403).send("The user does not exist.");
    }

    await user.removeFollowers(req.user.id);
    
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => { //GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("The user does not exist.");
    }

    const followers = await user.getFollowers();
    
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => { //GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); //confirm that the user exists!
    if (!user) {
      res.status(403).send("The user does not exist.");
    }

    const followings = await user.getFollowings();

    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => { //DELETE /user/follower/1, same logic as DELETE /user/1/followings
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); //confirm that the user exists!
    if (!user) {
      res.status(403).send("The user does not exist.");
    }

    await user.removeFollowings(req.user.id);
    
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  // POST /user/
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("The email is already in use");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); //status 500 (error from server.)
  }
});

module.exports = router;
