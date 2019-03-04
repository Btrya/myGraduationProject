<template>
  <div class="publish">
    <div class="publish-top f-center animated fadeInUp">
      <img mode="widthFix" src="../images/publish-banner.jpg"/>
      <h1>发布</h1>
    </div>
    <div class="publish-content f-vertical-center animated fadeInUp delay-1s">
      <i-form class="publish-form" ref='publishForm' :model="publishFormData" label-position="left" :label-width="130">
        <Form-item label="标题:" prop="title">
          <i-input v-model="publishFormData.title" placeholder="请输入标题"></i-input>
        </Form-item>
        <Form-item label="讯息类型:" prop="articleType">
          <RadioGroup v-model="publishFormData.articleType" type="button">
            <Radio label="招领启事"></Radio>
            <Radio label="寻物启事"></Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="上传图片:" prop="imageUrl">
          <Upload :action="domain"
            :show-upload-list="false"
            :before-upload="upqiniu">
              <Button icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </Form-item>
        <Form-item label="内容:" prop="content">
          <i-input v-model="publishFormData.content" placeholder="请输入内容"></i-input>
        </Form-item>
      </i-form>
    </div>
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
      qiniuaddr: 'cbcool.iok.la.qiniudns.com',
      publishFormData: {
        title: '',
        articleType: '招领启事',
        content: '',
        imageUrl: '',
        username: '',
        userId: ''
      }
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

<style lang="less">
.publish-top{
  line-height: 0;
  img{
    width: 100%;
    height: auto;
  }
  h1{
    position: absolute;
    font-size: 2.4rem;
    font-family: kxzdt;
    color: #333;
  }
}
.publish-content{
  width: 100%;
  height: 100vh;
  font-family: kxzdt;
  img{
    height: auto;
    width: 2.666667rem;
    border-radius: 50%;
  }
  .publish-form{
    margin-top: .6rem;
    width: 40%;
  }
  .ivu-form .ivu-form-item-label{
    font-size: .4rem;
  }
  .ivu-input{
    height: .853333rem;
    font-size: .32rem;
  }
  .ivu-divider-inner-text{
    font-family: kxzdt;
    font-size: .373333rem;
    color: #999;
  }
}
</style>
