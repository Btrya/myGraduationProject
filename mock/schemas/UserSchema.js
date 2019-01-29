var mongoose = require('mongoose')
var Schema = mongoose.Schema
//创建Schema
var usersSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, min: 6, required: true },
    phone: { type: Number, required: true },
    created_time: { type: Date, default: Date.now },
    last_modified_time: { type: Date, default: Date.now },
    avatar: { type: String, default: '/mock/avatar/avatar01.jpg' }
});
module.exports = usersSchema;
