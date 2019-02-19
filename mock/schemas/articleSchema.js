var mongoose = require('mongoose')
var Schema = mongoose.Schema
//创建Schema
var articlesSchema = new Schema({
    articleType: { type: String, required: true }, // 文章类型
    title: { type: String, required: true }, // 标题
    content: { type: String, required: true }, // 内容
    imageUrl: { type: String }, // 图片
    created_time: { type: Date, default: Date.now },
    last_modified_time: { type: Date, default: Date.now },
    username: { type: String, required: true }
});
module.exports = articlesSchema;
