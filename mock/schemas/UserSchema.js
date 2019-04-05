var mongoose = require('mongoose')
var Schema = mongoose.Schema
var utils = require('../utils/utils')
//创建Schema
var usersSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, min: 6, required: true },
    phone: { type: Number, required: true },
    created_time: { type: Date, default: utils.localDate() },
    last_modified_time: { type: Date, default: utils.localDate() },
    avatar: { type: String, default: '/mock/avatar/avatar01.jpg' }
});
module.exports = usersSchema;
