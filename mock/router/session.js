var express = require('express')
var router = express.Router()
const crypto = require('crypto');
//引入模型
var User = require('../models/user')
router.all('*',function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200); /让options请求快速返回/
    }
    else {
        next();
    }
});
router.get('/',function (req,res) {
    res.send('OJBK')
})

router.post('/register',async function (req,res) {
    var body = req.body;
    try{
        if(await User.findOne({email:body.email})){
            return res.status(200).json({
                err_code:1,
                message:'邮箱已存在'
            })
        }
        if(await User.findOne({userName:body.userName})){
            return res.status(200).json({
                err_code:2,
                message:'用户名已存在'
            })
        }
        //制定密钥
        const secret = 'hello world'
        //用Hmac算法加密密码
        const hmacPass = crypto.createHmac('sha256',secret )
            .update(body.password)
            .digest('hex')
        //数据插入到数据库
        var user = User({
            userName:body.userName,
            email:body.email,
            password:hmacPass,
        })
        await user.save()
        await User.findOne({userName:body.userName,password:hmacPass},function (err,docs) {
            if(err){
                return res.status(200).json({
                    err_code:3,
                    message:'验证有误，注册失败',
                })
            }
            return res.status(200).json({
                err_code:0,
                message:'注册成功',
                data:docs
            })
        })
    }catch (err) {
        res.status(500).json({
            err_code:500,
            message:err.message
        })
    }
})

router.post('/login',async function (req,res) {
    var body = req.body;
    //制定密钥
    const secret = 'hello world'
    //用Hmac算法加密密码
    const hmacPass = crypto.createHmac('sha256',secret )
        .update(body.password)
        .digest('hex')
    try{
        await User.findOne({userName:body.userName,password:hmacPass},function (err,docs) {
            if(err){
                return res.status(200).json({
                    err_code:3,
                    message:'密码错误，登录失败',
                })
            }
            return res.status(200).json({
                err_code:0,
                message:'登录成功',
                data:docs
            })
        })
    }catch (err) {
        res.status(500).json({
            err_code:500,
            message:'服务器错误'
        })
    }
})

module.exports = router
