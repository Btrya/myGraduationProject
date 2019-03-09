/*
七牛云配置
*/
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'o7pILGV4HLaqsD6reVOWqfleyhK0IeA4k5CAkdZY'
const secretKey = 'fEfnE2lHkyOD7DQ40XQsEPZVBSfHrMdfKFDe3fX6'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'btrya',
  expires: 604800 // Token有效期1星期
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

module.exports = {
  uploadToken
}
