<template>
  <div class="publish">
    <Upload :action="domain"
      :show-upload-list="false"
      :before-upload="upqiniu">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload>
  </div>
</template>

<script>
import { getToken, uploadQiNiu } from '../apis/upload.js'
export default {
  data() {
    return {
      imageUrl: '',
      token: {},
      // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
      domain: 'https://upload-z2.qiniup.com',
      // 这是七牛云空间的外链默认域名
      qiniuaddr: 'cbcool.iok.la.qiniudns.com'
    };
  },
  methods: {
    // 上传文件到七牛云
    upqiniu (file) {
      this.beforeUpload(file)
      const config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      let filetype = ''
      if (file.type === 'image/png') {
        filetype = 'png'
      } else {
        filetype = 'jpg'
      }
      // 重命名要上传的文件
      const keyname = 'btrya' + new Date().getTime() + Math.floor(Math.random() * 100) + '.' + filetype
      // 从后端获取上传凭证token
      getToken().then(res => {
        const token = res.data
        const formdata = new FormData()
        formdata.append('file', file)
        formdata.append('token', token)
        formdata.append('key', keyname)
        uploadQiNiu(formdata).then(res1 => {
          console.log(res1)
        })
      })
      // this.axios.get('/getToken').then(res => {
      //   console.log(res)
      //   const formdata = new FormData()
      //   formdata.append('file', req.file)
      //   formdata.append('token', res.data)
      //   formdata.append('key', keyname)
      //   // 获取到凭证之后再将文件上传到七牛云空间
      //   this.axios.post(this.domain, formdata, config).then(res => {
      //     this.imageUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
      //     // console.log(this.imageUrl)
      //   })
      // })
      return false
    },
    // 验证文件合法性
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
};
</script>

<style lang="less" scoped>
</style>
