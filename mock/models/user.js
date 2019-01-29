var mongoose = require('mongoose');
var UsersSchema = require('../schemas/userSchema');
//创建model，这个地方的lf_article对应mongodb数据库中lf_article的conllection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money
var User = mongoose.model('lf_user',UsersSchema);
module.exports = User;
