const express= require('express');
const postRouter = require('./routes/post');

const app = express();

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


app.use('/post',postRouter);


app.listen(3065, () => {
    console.log("Server Running on Port#3065...");
})