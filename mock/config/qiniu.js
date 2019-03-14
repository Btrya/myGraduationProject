//七牛云配置
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'o7pILGV4HLaqsD6reVOWqfleyhK0IeA4k5CAkdZY'  // AK
const secretKey = 'fEfnE2lHkyOD7DQ40XQsEPZVBSfHrMdfKFDe3fX6'  // SK
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'btrya', // 仓库名
  expires: 604800 // Token有效期1星期
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

module.exports = {
  uploadToken
}
