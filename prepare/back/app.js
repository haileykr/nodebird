const express= require('express');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const db = require('./models');

const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('db connection success');
    })
    .catch(
        console.error
    );
    
app.use(express.json()); // json format covered
app.use(express.urlencoded({extended: true})); //form submit

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