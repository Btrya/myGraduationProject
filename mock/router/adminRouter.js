var express = require('express')
var router = express.Router()
var utils = require('../utils/utils')
const crypto = require('crypto');
//引入模型
var Admin = require('../models/admin')
router.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200); /*让options请求快速返回*/
  } else {
    next();
  }
});

// 将已有用户注册为管理员
router.post('/backend/regAdmin', async function (req, res) {
  var body = req.body;
  try {
    var admin = Admin({
      userId: body.userId
    })
    await admin.save()
    await Admin.findOne({
      userId: body.userId
    }, function (err, docs) {
      if (err) {
        return res.status(200).json({
          err_code: 4,
          message: '服务器出错：' + err,
        })
      }
      if (docs) {
        return res.status(200).json({
          err_code: 0,
          message: '注册成功',
          //   data:docs
          data: {}
        })
      } else {
        return res.status(200).json({
          err_code: 1,
          message: '注册失败',
          //   data:docs
          data: {}
        })
      }
    })
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

// 管理员登录
router.post('/backend/login', async function (req, res) {
  var body = req.body
  // 制定密钥
  const secret = 'hello world'
  // 用Hmac算法加密密码
  const hmacPass = crypto.createHmac('sha256', secret)
    .update(body.password)
    .digest('hex')
  try {
    await Admin.find().populate('userId').exec(function(res, docs) {
      console.log(res)
      console.log(docs)
    })
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: '服务器错误'
    })
  }
})
module.exports = router
