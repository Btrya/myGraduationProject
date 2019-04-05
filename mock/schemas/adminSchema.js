var mongoose = require('mongoose')
var Schema = mongoose.Schema
var utils = require('../utils/utils')
//创建Schema
var adminSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    ref: 'lf_user'
  },
  manageAdmin: { type: Boolean, default: false}, // 管理管理员权限
  delArticle: { type: Boolean, default: false} // 删除文章权限
});

module.exports = adminSchema;
