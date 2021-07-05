const express = require("express");
const cors = require("cors");
const passport = require("passport");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");

const db = require("./models");

const passportConfig = require("./passports/index");

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("db connection success");
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin:"http://wesoodaa.site",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    }));
}

app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // json format covered
app.use(express.urlencoded({ extended: true })); //form submit

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, //not accessible via JavaScript
      secure: false, //http
      domain: process.env.NODE_ENV === "production" && ".wesoodaa.site", //cookie shared between api.~ and ~
    },
  }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("HI!!!");
});

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

app.listen(80, () => {
  console.log("Server Running on Port #...");
});
