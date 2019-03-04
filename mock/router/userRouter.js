var express = require('express')
var router = express.Router()
const crypto = require('crypto');
//引入模型
var User = require('../models/user')
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
router.get('/', function (req, res) {
  res.send('OJBK')
})

router.post('/register', async function (req, res) {
  var body = req.body;
  try {
    if (await User.findOne({
        phone: body.phone
      })) {
      return res.status(200).json({
        err_code: 1,
        message: '该手机号已存在'
      })
    }
    if (await User.findOne({
        username: body.username
      })) {
      return res.status(200).json({
        err_code: 1,
        message: '该用户名已存在'
      })
    }
    //制定密钥
    const secret = 'hello world'
    //用Hmac算法加密密码
    const hmacPass = crypto.createHmac('sha256', secret)
      .update(body.password)
      .digest('hex')
    //数据插入到数据库
    var user = User({
      username: body.username,
      phone: body.phone,
      password: hmacPass,
    })
    await user.save()
    await User.findOne({
      username: body.username,
      password: hmacPass
    }, {
      _id: 1,
      username: 1,
      phone: 1,
      avatar: 1
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
          data: {
            objectId: docs._id,
            username: docs.username,
            phone: docs.phone,
            avatar: docs.avatar
          }
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

router.post('/login', async function (req, res) {
  var body = req.body
  //制定密钥
  const secret = 'hello world'
  //用Hmac算法加密密码
  const hmacPass = crypto.createHmac('sha256', secret)
    .update(body.password)
    .digest('hex')
  try {
    await User.findOne({
      phone: body.username,
      password: hmacPass
    }, {
      _id: 1,
      username: 1,
      phone: 1,
      avatar: 1
    }, function (err, docs) {
      if (err) {
        return res.status(200).json({
          err_code: 4,
          message: '服务器错误：' + err,
        })
      }
      if (docs) {
        return res.status(200).json({
          err_code: 0,
          message: '登录成功',
          //   data:docs
          data: {
            objectId: docs._id,
            username: docs.username,
            phone: docs.phone,
            avatar: docs.avatar
          }
        })
      } else {
        return res.status(200).json({
          err_code: 1,
          message: '登录失败，请检查用户名和密码是否正确',
          //   data:docs
          data: {}
        })
      }
    })
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: '服务器错误'
    })
  }
})

router.post('/updateUser', async function (req, res) {
  var body = req.body
  let checkObj = {
    _id: body._id
  }
  let setObj = {
    username: body.username,
    avatar: body.avatar,
    last_modified_time: localDate()
  }
  if (body.password && body.newPassword) {
    //制定密钥
    const secret = 'hello world'
    //用Hmac算法加密密码
    const hmacPass = crypto.createHmac('sha256', secret)
      .update(body.password)
      .digest('hex')
    const newHmacPass = crypto.createHmac('sha256', secret)
      .update(body.newPassword)
      .digest('hex')
    checkObj.password = hmacPass
    setObj.password = newHmacPass
  }
  try {
    await User.findOneAndUpdate(checkObj, {
      $set: setObj
    }, {
      _id: 1,
      username: 1,
      phone: 1,
      avatar: 1,
      new: true
    }, function (err, docs) {
      if (err) {
        return res.status(200).json({
          err_code: 1,
          message: '修改失败' + err
        })
      }
      if (!docs) {
        return res.status(200).json({
          err_code: 1,
          message: '修改失败,旧密码有误'
        })
      } else {
        return res.status(200).json({
          err_code: 0,
          message: '修改成功',
          data: {
            objectId: docs._id,
            username: docs.username,
            phone: docs.phone,
            avatar: docs.avatar
          }
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

function localDate(v) {
  const d = new Date(v || Date.now())
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString()
}
module.exports = router
