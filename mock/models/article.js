var mongoose = require('mongoose');
var ArticlesSchema = require('../schemas/articleSchema');
//创建model，这个地方的lf_article对应mongodb数据库中lf_article的conllection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money
var Article = mongoose.model('lf_article',ArticlesSchema);
module.exports = Article;
