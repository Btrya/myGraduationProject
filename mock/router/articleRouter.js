var express = require('express')
var router = express.Router()
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
      title: body.title, // 标题
      content: body.content, // 内容
      imageUrl: body.imageUrl, // 图片
      username: body.username
    })
    await article.save()
    await Article.findOne({
      articleType: body.articleType,
      title: body.title,
      username: body.username
    }, function (err, docs) {
      if (err) {
        return res.status(500).json({
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

// 删除文章接口
router.get('/article/getIndexArticle', async function (req, res) {
  var body = req.query;
  try {
    await Article.find({}, function(err, docs){
      if(err){
        return res.status(500).json({
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
    }).sort({"created_time": -1})
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

module.exports = router
