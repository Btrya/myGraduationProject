var express = require('express')
var router = express.Router()
var utils = require('../utils/utils')
const crypto = require('crypto');
//引入模型
var Article = require('../models/article')
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

// 发布文章接口
router.post('/article/publish', async function (req, res) {
  var body = req.body;
  if (!body.imageUrl) {
    body.imageUrl = ''
  }
  try {
    //数据插入到数据库
    var article = Article({
      articleType: body.articleType, // 文章类型
      contact: body.contact, // 联系方式
      place: body.place, // 地点
      // title: body.title, // 标题
      content: body.content, // 内容
      imageUrl: body.imageUrl, // 图片
      product: body.product, // 寻找、招领的物品
      username: body.username,
      userId: body.userId,
      time_quantum: body.timeQuantum, // 时间段
      created_time: utils.localDate(),
      last_modified_time: utils.localDate()
    })
    await article.save()
    await Article.findOne({
      articleType: body.articleType,
      title: body.title,
      username: body.username
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
          message: '发布成功',
          //   data:docs
          data: {}
        })
      } else {
        return res.status(200).json({
          err_code: 1,
          message: '发布失败',
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

// 删除文章接口
router.get('/article/delete', async function (req, res) {
  var body = req.query;
  try {
    await Article.deleteOne({_id: body._id},function(err, docs){
      if(err){
        return res.status(200).json({
          err_code: 1,
          message: '删除失败' + err
        })
      } else {
        return res.status(200).json({
          err_code: 0,
          message: '删除成功',
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

// 首页获取文章列表(各前10条)
router.get('/article/getIndexArticle', async function (req, res) {
  var body = req.query;
  let resData = {}
  try {
    await Article.find({articleType: 'found'}, {
      articleType: 0,
      __v: 0,
      last_modified_time: 0
    }, function(err, docs){
      if(err){
        return res.status(200).json({
          err_code: 1,
          message: '查询失败' + err
        })
      } else {
        resData.foundData = docs
      }
    }).sort({"created_time": -1}).limit(10)
    await Article.find({articleType: 'lose'}, {
      articleType: 0,
      __v: 0,
      last_modified_time: 0
    }, function(err, docs){
      if(err){
        return res.status(200).json({
          err_code: 1,
          message: '查询失败' + err
        })
      } else {
        resData.loseData = docs
      }
    }).sort({"created_time": -1}).limit(10)
    return res.status(200).json({
      err_code: 0,
      message: '查询成功',
      data: resData
    })
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

// 根据文章id查询对应文章
router.post('/article/getArticleById', async function(req, res) {
  var body = req.body
  try {
    await Article.findOne({ _id:body.id }, { __v: 0 }, function(err, docs){
      if (err) {
        return res.status(200).json({
          err_code: 1,
          message: '查询失败' + err
        })
      } else {
        return res.status(200).json({
          err_code: 0,
          message: '查询成功',
          data: docs
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      err_code: 500,
      message: error.message
    })
  }
})

// 根据条件获取文章
router.post('/article/getArticle', async function (req, res) {
  var body = req.body;
  let checkObj = {articleType: body.articleType}
  if (body.userId){
    checkObj.userId = body.userId
  }
  let checkArr = [ checkObj ]
  if (body.product){
    const reg = { $regex: new RegExp(body.product, 'i') }
    const orObj = { $or : [ { product : reg }, { place : reg } ] }
    checkArr.push(orObj)
  }
  let resData = {}
  try {
    await Article.find( {$and : checkArr} , { userId: 0, __v: 0 }, function(err, docs){
      if(err){
        return res.status(200).json({
          err_code: 1,
          message: '查询失败' + err
        })
      } else {
        resData.data = docs
      }
    }).sort({"created_time": -1}).skip((body.pageNum - 1) * body.pageSize).limit(~~body.pageSize)
    await Article.countDocuments(checkObj, function(err, count) {
      if (err) {
        return res.status(200).json({
          err_code: 1,
          message: '查询失败' + err
        })
      } else {
        resData.total = count
        resData.pageNum = ~~body.pageNum
        resData.pageSize = ~~body.pageSize
      }
    })
    return res.status(200).json({
      err_code: 0,
      message: '查询成功',
      data: resData
    })
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

// 修改文章接口
router.post('/article/update', async function (req, res) {
  var body = req.body;
  let setObj = {
    articleType: body.articleType, // 文章类型
    contact: body.contact, // 联系方式
    place: body.place, // 地点
    content: body.content, // 内容
    imageUrl: body.imageUrl, // 图片
    product: body.product, // 寻找、招领的物品
    username: body.username,
    userId: body.userId,
    time_quantum: body.timeQuantum, // 时间段
    last_modified_time: utils.localDate(),
    created_time: body.created_time
  }
  try {
    await Article.findOneAndUpdate({_id: body._id}, {$set: setObj}, function(err, docs){
      if(err){
        return res.status(200).json({
          err_code: 1,
          message: '修改失败' + err
        })
      } else {
        return res.status(200).json({
          err_code: 0,
          message: '修改成功',
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

// 根据id删除文章
router.post('/article/deleteById', async function (req, res) {
  var body = req.body;
  try {
    await Article.deleteOne({_id: body._id}, function(err, docs){
      if(err){
        return res.status(200).json({
          err_code: 1,
          message: '删除失败' + err
        })
      } else {
        return res.status(200).json({
          err_code: 0,
          message: '删除成功',
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

module.exports = router
