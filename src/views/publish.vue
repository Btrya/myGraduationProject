<template>
  <div class="publish">
    <div class="publish-top f-center animated fadeInLeft">
      <img mode="widthFix" src="../images/publish-banner.jpg"/>
      <h1>发布</h1>
    </div>
    <div class="publish-content f-vertical-center animated fadeInLeft delay-1s">
      <i-form class="publish-form" ref='publishForm' :model="publishFormData" :rules="ruleValidate" label-position="left" :label-width="130">
        <Form-item label="讯息类型:" prop="articleType">
          <RadioGroup v-model="publishFormData.articleType" type="button">
            <Radio label="招领启事"></Radio>
            <Radio label="寻物启事"></Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="物品:" prop="product">
          <i-input v-model="publishFormData.product" placeholder="请输入找到/丢失的物品"></i-input>
        </Form-item>
        <Form-item label="地点:" prop="place">
          <i-input v-model="publishFormData.place" placeholder="请输入找到/丢失物品时候的地点"></i-input>
        </Form-item>
        <Form-item class="publish-timeQuantum" label="发生时间段:" prop="timeQuantum">
          <DatePicker v-model="publishFormData.timeQuantum" :options="options" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择发生时间段" size="large" style="width: 60%;" @on-change="changeTimeQuantum"></DatePicker>
        </Form-item>
        <Form-item label="联系方式:" prop="contact">
          <div class="f-vertical">
            <Select v-model="publishFormData.contact[0]" size="large" @on-change="changeContact" style="width:200px">
                <Option v-for="item in contactOptions" :value="item.value" :key="item.value" :label="item.value"></Option>
            </Select>
            <i-input v-model="publishFormData.contact[1]" placeholder="请输入联系方式"></i-input>
          </div>
        </Form-item>
        <Form-item label="上传图片:" prop="imageUrl">
          <myUpload v-on:getImageUrl="getImageUrl"></myUpload>
        </Form-item>
        <Form-item class="publish-editor" label="描述:" prop="content">
          <mavonEditor ref="publishEditor" :content.sync="publishFormData.content" v-on:updateContent="updateContent"></mavonEditor>
        </Form-item>
        <Form-item>
          <i-button class="personal-submit" type="primary" @click="validForm('publishForm')">发布</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import mavonEditor from "../components/mavon"
import myUpload from "../components/upload"
import { getToken, uploadQiNiu } from '../apis/upload.js'
import { publish } from '../apis/article.js'
export default {
  components: {
    mavonEditor,
    myUpload
  },
  data() {
    const validateContact = (rule, value, callback) => {
      if (!value[1]) {
        callback(new Error("联系方式不能为空"))
        return
      }
      if (value[0] === '手机号') {
        if(!(/^1[34578]\d{9}$/.test(value[1]))){ 
          callback(new Error("手机号码有误，请重填"))
          return 
        }
      } else if (value[0] === '邮箱') {
        if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value[1]))){ 
          callback(new Error("邮箱格式有误，请重填"))
          return 
        }
      }
      callback()
    }
    const validateTime = (rule, value, callback) => {
      if (!value[1]) {
        callback(new Error("时间段异常，请重新选择"))
        return
      }
      callback()
    }
    const validateRequired = (rule, value, callback) => {
      if (!value) {
        callback(new Error("此项为必填项"))
        return
      }
      callback()
    }
    return {
      publishFormData: {
        contact: ['手机号', ''],
        product: '',
        place: '',
        articleType: '招领启事',
        content: '',
        imageUrl: '',
        username: '',
        userId: '',
        timeQuantum: ''
      },
      ruleValidate: {
        product: [
          { validator: validateRequired, trigger: "blur" }
        ],
        contact: [
          { validator: validateContact, trigger: "blur" }
        ],
        place: [
          { validator: validateRequired, trigger: "blur" }
        ],
        timeQuantum: [
          { validator: validateTime, trigger: "change" }
        ],
        content: [
          { validator: validateRequired, trigger: "blur" }
        ]
      },
      // 设置不可选日期
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      // 联系方式选项
      contactOptions: [
        {
          value: '手机号'
        },
        {
          value: '微信'
        },
        {
          value: '邮箱'
        }
      ]
    };
  },
  methods: {
    // 初始化用户信息
    initUser() {
      this.publishFormData = {
        contact: ['手机号', ''],
        product: '',
        place: '',
        articleType: '招领启事',
        content: '',
        imageUrl: '',
        username: '',
        userId: '',
        timeQuantum: ''
      }
      const { username, objectId, phone } = this.$store.getters.getUser
      this.publishFormData.username = username
      this.publishFormData.userId = objectId
      this.publishFormData.contact[1] = phone
      this.$refs.publishEditor.clearValue()
    },
    // 接收由子组件传过来的值，之后赋值到表单的content里
    updateContent(val) {
      this.publishFormData.content = val
    },
    // 接收上传子组件传过来的值
    getImageUrl(val) {
      this.publishFormData.imageUrl = val
    },
    // 校验表单
    validForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success("提交成功!")
          this.publishArticle()
        } else {
          this.$Message.error("表单验证失败！")
        }
      })
    },
    // 发布
    async publishArticle() {
      let { publishFormData } = this
      // 改变传入的文章类型为lose/found
      publishFormData.articleType = publishFormData.articleType === '招领启事' ? 'found' : 'lose'
      await publish(publishFormData).then(res => {
        if (res.data.err_code === 0) {
          this.$Message.success('发布成功！')
          this.initUser()
          this.$router.push('/')
          return
        }
        this.$Message.error(res.data.message)
      })
    },
    // 获取格式化后的日期
    changeTimeQuantum(format) {
      this.publishFormData.timeQuantum = format
    },
    // 选择联系方式
    changeContact(value) {
      const { phone } = this.$store.getters.getUser
      if (value === '手机号') {
        this.publishFormData.contact[1] = phone
        return
      }
      this.publishFormData.contact[1] = ''
    }
  },
  mounted() {
    this.initUser()
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
  .publish-form{
    margin-top: .6rem;
    width: 65%;
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
  .ivu-radio-group-button .ivu-radio-wrapper{
    line-height: .8rem;
    height: .8rem;
    font-size: .32rem;
  }
  .ivu-btn{
    height: .8rem;
    width: 2.4rem;
    font-size: .266667rem;
  }
  .personal-submit{
    height: 1rem;
    width: 2.4rem;
    margin: .3rem .4rem 0 0;
    font-size: .32rem;
  }
  .ivu-select-dropdown{    
    z-index: 9999;
  }
  .ivu-input-wrapper-large .ivu-input-icon{
    line-height: .8rem;
  }
  // 下拉选择框
  .ivu-select-large.ivu-select-single .ivu-select-selection{
    height: .88rem;
  }
  .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    height: .84rem;
    line-height: .8rem;
    font-size: .32rem;
  }
}
</style>
