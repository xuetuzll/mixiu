// @login & register
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

//调用接口需要加上文件夹的名字
//$route GET api/users/test
router.get("/test", (req, res) => {
    res.json({msg: "profile works"})
    //res.json()//返回json数据
});

// @route POST api/profiles/add
// @desc 创建信息接口
// @access Private
router.post("/add", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};
    //存在不添加，直接赋给对应的值
    if(req.body.type) profileFields.type = req.body.type
    if(req.body.discribe) profileFields.discribe = req.body.discribe
    if(req.body.income) profileFields.income = req.body.income
    if(req.body.expend) profileFields.expend = req.body.expend
    if(req.body.cash) profileFields.cash = req.body.cash
    if(req.body.remark) profileFields.remark = req.body.remark

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    })
});

// @route GET api/profiles
// @desc 获取所有信息
// @access private

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find()
        .then(profile => {
            if(!profile){
                return res.status(404).json("没有任何内容");
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route GET api/profiles/:id
// @desc 获取id相关的信息
// @access private

router.get("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({_id:req.params.id})
        .then(profile => {
            if(!profile){
                return res.status(404).json("没有任何内容");
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route POST api/profiles/edit
// @desc 编辑信息接口
// @access Private
router.post("/edit/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};
    //存在不添加，直接赋给对应的值
    if(req.body.type) profileFields.type = req.body.type
    if(req.body.discribe) profileFields.discribe = req.body.discribe
    if(req.body.income) profileFields.income = req.body.income
    if(req.body.expend) profileFields.expend = req.body.expend
    if(req.body.cash) profileFields.cash = req.body.cash
    if(req.body.remark) profileFields.remark = req.body.remark

    Profile.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileFields},
        {new: true}
    ).then(profile => res.json(profile))
});

// @route GET api/profiles/:id
// @desc 获取id相关的信息
// @access private

router.delete("/delete/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({_id:req.params.id})
        .then(profile => {
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json("删除失败"));
});


module.exports = router;