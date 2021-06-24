const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User } = require("../models"); // index.js에서 db에 User가 담겨 exports되어 접근 가능해 짐!

const router = express.Router();

router.post("/login", (req, res, next) => {
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

    return req.login(user, async (loginErr) => {
      //passport login
      if (loginError) {
        //if error during passportlogin
        console.error(loginError);
        return next(loginError);
      }
      return res.json(user); //user info
    });
  })(req, res, next);
}); //POST /user/login

router.post("/", async (req, res, next) => {
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
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); //status 500 (error from server.)
  }
});

module.exports = router;
