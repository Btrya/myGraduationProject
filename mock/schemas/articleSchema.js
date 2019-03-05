var mongoose = require('mongoose')
var Schema = mongoose.Schema
var utils = require('../utils/utils')
//创建Schema
var articlesSchema = new Schema({
    articleType: { type: String, required: true }, // 文章类型
    // title: { type: String, required: true }, // 标题（暂时不需要）
    contact: { type: Array, required: true },
    content: { type: String, required: true }, // 内容
    imageUrl: { type: String }, // 图片
    product: { type: String, required: true }, // 寻找/丢失的物品
    time_quantum: { type: Array, required: true }, // 发生时间段
    created_time: { type: Date, default: utils.localDate() },
    last_modified_time: { type: Date, default: utils.localDate() },
    username: { type: String, required: true },
    userId: { type: String, required: true }
});

module.exports = articlesSchema;
