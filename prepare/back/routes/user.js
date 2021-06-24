const express = require('express');
const {User} =require('../models');// index.js에서 db에 User가 담겨 exports되어 접근 가능해 짐!
const router = express.Router();


router.post('/',async (req,res)=>{ // POST /user/

    await User.create({
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password
    })
    res.json()

});

module.exports = router;