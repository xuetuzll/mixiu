// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");

//调用接口需要加上文件夹的名字
//$route GET api/users/test
router.get("/test", (req, res) => {
    res.json({msg: "login works"})
    //res.json()//返回json数据
})

//使用安装body-parser才能使用post
router.post("/register", (req, res) => {
    // console.log(req.body);

    //查询数据库中是否拥有邮箱
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json('邮箱已被注册！');
            } else {
                //邮箱对应的图片，r代表图片的格式，从gravatar网站上拿图片
                //如果是已经注册的邮箱会得到它对应的头像
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })
                //加密使用bcrypt
                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

//$route POST api/users/login
//@desc  返回token jwt passport
//@access public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json('用户不存在');
            }
            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        // jwt.sign("规则", "加密名字", "过期时间", "箭头函数");
                        jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                            if(err) throw err;
                            //使用passport验证的话，名字一定要写成"Bearer "
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                        // res.json({msg: "success"});
                    } else {
                        return res.status(400).json('密码错误')
                    }
                })
        })
})

// $route GET api/users/current
// @desc   return current user
// @access Private

//user用户信息通过email查询数据库匹配得到
router.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
})

module.exports = router;