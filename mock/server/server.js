var express = require('express')
var bodyParser = require('body-parser')
var userRouter = require('../router/userRouter')
var articleRouter = require('../router/articleRouter')

var app = express()
var mongoose = require('../config/mongoose.js');
// 引入七牛云配置
console.log('更新七牛云token...')
const qnconfig = require('../config/qiniu.js')
var db = mongoose();
// 定时引入七牛云配置，更新token
setInterval(() => {
  // 引入七牛云配置
  console.log('更新七牛云token...')
  const qnconfig = require('../config/qiniu.js')
}, 7200000);
//配置解析表单POST请求体插件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())
//引入路由
app.use(userRouter)
app.use(articleRouter)

// //跨域头
// app.all('*',function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//     if (req.method == 'OPTIONS') {
//         res.sendStatus(200); /*让options请求快速返回*/
//     }
//     else {
//         next();
//     }
// });
app.listen(3000, function () {
    console.log('open sever successful, listen in port: 3000')
})
app.get('/getToken', (req, res, next) => {
    // console.log(qnconfig.uploadToken)
    res.status(200).send(qnconfig.uploadToken)
})

