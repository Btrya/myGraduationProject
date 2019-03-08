<template>
  <div class="myUpload">
    <div v-if="imageUrl === ''">
      <Upload :action="domain"
        :show-upload-list="false"
        :before-upload="upqiniu">
        <div class="myUpload-nopic f-center">
          <Icon type="ios-camera"></Icon>
        </div>
      </Upload>
    </div>
    <div v-else class="myUpload-cover" @mouseenter="showIcon = true" @mouseleave="showIcon = false">
      <img :src="imageUrl"/>
      <div v-show="showIcon" class="icon-cover f-center f-vertical">
        <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
      </div>
    </div>
    <Modal title="查看大图" v-model="showModal" style="width: 500px;">
      <img v-if="showModal" class="myUpload-modal-img" mode="widthFix" :src="imageUrl">
    </Modal>
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
      qiniuaddr: 'btrya.luozhiwen.com.qiniudns.com',
      showIcon: false,
      showModal: false
    }
  },
  methods: {
    // 上传文件到七牛云
    upqiniu (file) {
      const that = this
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
          that.imageUrl = 'http://btrya.luozhiwen.com/' + res1.data.key
        })
      })
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
    },
    // 点击删除文件
    handleRemove() {
      this.imageUrl = ''
    },
    // 点击查看大图
    handleView() {
      this.showModal = true
    }
  }
};
</script>

<style lang="less">
.myUpload-modal-img{
  width: 100% !important;
  height: auto !important;
}
.myUpload{
  width: 4rem;
  height: 4rem;
  .myUpload-nopic{
    cursor: pointer;
    width: 4rem;
    height: 4rem;
    border: 1px dashed #999;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    .ivu-icon{
      font-size: .866667rem;
    }
  }
  .myUpload-nopic:hover{
    .ivu-icon{
      font-size: 1.066667rem;
    }
  }
  .myUpload-cover{
    img{
      width: 4rem;
      height: 4rem;
    }
    .icon-cover{
      width: 4rem;
      height: 4rem;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .6);
    }
    .ivu-icon{
      cursor: pointer;
      font-size: .866667rem;
      color: #fff;
      margin: 0 .133333rem;
    }
  }
}
</style>
