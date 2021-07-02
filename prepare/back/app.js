const express= require('express');
const cors = require('cors');
const passport=require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const morgan = require('morgan');
const path = require("path");


const db = require('./models');

const passportConfig =  require('./passports/index');

dotenv.config();
const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('db connection success');
    })
    .catch((err) => {
        console.error(err)
    });
passportConfig();
    
app.use(morgan('dev'));

app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}));
app.use("/", express.static(path.join(__dirname,"uploads")));
app.use(express.json()); // json format covered
app.use(express.urlencoded({extended: true})); //form submit

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({

    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('HI!!!');
})


app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);


app.listen(3065, () => {
    console.log("Server Running on Port#3065...");
})