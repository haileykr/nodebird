const express= require('express');
const cors = require('cors');
const passport=require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');


const db = require('./models');

const passportConfig =  require('./passports/index');

dotenv.config();
const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('db connection success');
    })
    .catch(
        console.error
    );
passportConfig();
    
app.use(cors({
    origin: '*', // fix it when in production
    credentials: false
}));
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


app.get('/posts', (req, res) => {
    res.json([
        {id: 1, content: 'Hello'},
        {id: 1, content: 'Hello'},
        {id: 1, content: 'Hello'},
    ])

});


app.use('/post', postRouter);
app.use('/user', userRouter);


app.listen(3065, () => {
    console.log("Server Running on Port#3065...");
})