<template>
  <div class="myUpload">
    <div v-if="uploadStatus === 0">
      <Upload :action="domain"
        :show-upload-list="false"
        :before-upload="upqiniu">
        <div class="myUpload-nopic f-center" :class="{ myUploadCir: isCircular }">
          <Icon type="ios-camera"></Icon>
        </div>
      </Upload>
    </div>
    <!-- 进度条 -->
    <div v-else-if="uploadStatus === 1" class="myUpload-progress f-center" :class="{ myUploadCir: isCircular }">
      <Progress :percent="progressPer" status="active" hide-info :stroke-width="15"/>
    </div>
    <div v-else-if="uploadStatus === 2" class="myUpload-cover" @mouseenter="showIcon = true" @mouseleave="showIcon = false">
      <img :src="imageUrl" :class="{ myUploadCir: isCircular }"/>
      <div v-show="showIcon" class="icon-cover f-center f-vertical" :class="{ myUploadCir: isCircular }">
        <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
      </div>
    </div>
    <!-- 查看大图弹出框 -->
    <Modal title="查看大图" v-model="showModal" :styles="{top: '20px'}">
      <img v-if="showModal" class="myUpload-modal-img" mode="widthFix" :src="imageUrl">
      <div slot="footer">
        <Button type="primary" size="large" long @click="showModal= false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken, uploadQiNiu } from '../apis/upload.js'
export default {
  props: {
    isCircular: {
      type: Boolean,
      default: false
    },
    oldPic: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      token: {},
      // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
      domain: 'https://upload-z2.qiniup.com',
      // 这是七牛云空间的外链默认域名
      qiniuaddr: 'img.btrya.xyz.qiniudns.com',
      showIcon: false,
      showModal: false,
      uploadStatus: 0,
      progressPer: 0
    }
  },
  methods: {
    // 上传文件到七牛云
    upqiniu (file) {
      this.progressInc()
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
          that.imageUrl = 'http://img.btrya.xyz/' + res1.data.key
          that.uploadStatus = 2 // 显示图片
          that.showIcon = false
          that.$emit('getImageUrl', that.imageUrl)
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
      this.uploadStatus = 0 // 状态重置
      this.$emit('getImageUrl', this.imageUrl)
    },
    // 点击查看大图
    handleView() {
      this.showModal = true
    },
    // 进度条增长
    progressInc() {
      this.uploadStatus = 1 // 显示进度条
      const that = this
      let timer = setInterval(() => {
        if (that.progressPer <= 80) {
          that.progressPer += 2
        }
        if (that.uploadStatus !== 1) {
          that.progressPer = 0
          clearInterval(timer)
        } 
      }, 400)
    }
  },
  mounted() {

  },
  watch: {
    // 监听value的变化，并且将变化后的值传给父组件
    oldPic(val) {
      if (val !== '') {
        this.imageUrl = val
        this.uploadStatus = 2
      }
    }
  }
};
</script>

<style lang="less">
.myUpload-modal-img{
  width: 100% !important;
  height: auto !important;
}
.myUploadCir{
  border-radius: 50%;
}
.myUpload{
  width: 3.466667rem;
  height: 3.466667rem;
  .myUpload-progress{
    width: 3.466667rem;
    height: 3.466667rem;
    border: 1px dashed #999;
    .ivu-progress-outer{
      width: 85%;
      margin-left: .333rem;
    }
  }
  .myUpload-nopic{
    cursor: pointer;
    width: 3.466667rem;
    height: 3.466667rem;
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
      border: 1px solid #999;
      width: 3.466667rem;
      height: 3.466667rem;
    }
    .icon-cover{
      width: 3.466667rem;
      height: 3.466667rem;
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
