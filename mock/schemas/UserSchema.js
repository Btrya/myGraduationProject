var mongoose = require('mongoose')
var Schema = mongoose.Schema
//创建Schema
var usersSchema = new Schema({
    userName:{type:String,required:true},
    password:{type:String,min:6,required:true},
    email:{type:String,required:true},
    created_time:{type:Date,default:Date.now},
    last_modified_time:{type:Date,default:Date.now},
    avatar:{type:String,default:'/mock/avatar/avatar01.jpg'},
});
module.exports = usersSchema;
