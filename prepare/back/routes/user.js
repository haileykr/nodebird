const express = require('express');
const bcrypt = require('bcrypt');
const {User} =require('../models');// index.js에서 db에 User가 담겨 exports되어 접근 가능해 짐!


const router = express.Router();


router.post('/',async (req,res, next)=>{ // POST /user/

    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (exUser) {
            return res.status(403).send('이미 사용중인 이메일입니다');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword
        })
        res.status(201).send('ok');
    } catch (error){
        console.error(error);
        next(error); //status 500 (error from server.)
    }

});

module.exports = router;