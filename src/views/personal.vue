<template>
  <div class="personal">
    <div class="personal-top f-center">
      <img mode="widthFix" src="../images/person-banner.jpg"/>
      <h1>欢迎来到个人中心</h1>
    </div>
    <div v-if="showArrow" class="personal-downArrow f-center" @click="gotoBottom">
      <img mode="widthFix" src="../images/icon-down.png">
    </div>
    <div class="personal-content f-vertical-center">
      <i-form class="personal-form" ref='settingForm' :model="settingFormData" :rules="ruleValidate" label-position="left" :label-width="130">
        <Form-item label="头像:" prop="avatar">
          <myUpload :oldPic="settingFormData.avatar" :isCircular="true" v-on:getImageUrl="getImageUrl"></myUpload>
          <!-- <img mode="widthFix" :src="settingFormData.avatar"> -->
        </Form-item>
        <Form-item label="用户名:" prop="username">
          <i-input v-model="settingFormData.username" placeholder="请输入要修改的用户名"></i-input>
        </Form-item>
        <Form-item label="手机号:" prop="phone">
          <i-input v-model="settingFormData.phone" disabled></i-input>
        </Form-item>
        <Divider>修改密码请填写旧密码以及新密码，不填不修改</Divider>
        <Form-item label="旧密码:" prop="password">
          <i-input type="password" v-model="settingFormData.password" placeholder="请输入旧密码"></i-input>
        </Form-item>
        <Form-item label="新密码:" prop="newPassword">
          <i-input type="password" v-model="settingFormData.newPassword" placeholder="请输入新密码"></i-input>
        </Form-item>
        <Form-item label="重复新密码:" prop="passagain">
          <i-input type="password" v-model="settingFormData.passagain" placeholder="请再次输入新密码"></i-input>
        </Form-item>
        <Form-item>
          <i-button class="personal-submit" type="primary" @click="validForm('settingForm')">修改</i-button>
          <i-button class="personal-reset" @click="initUser">重置</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import myUpload from "../components/upload"
import { updateUser } from '../apis/login.js'
export default {
  components: {
    myUpload
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空"))
        return
      }
      var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]']
      if (new RegExp(ranges.join('|'), 'g').test(value)) {
        callback(new Error("不可加入表情"))
        return
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (this.settingFormData.newPassword) {
        callback(new Error("请输入旧密码"))
        return
      }
      callback()
    }
    const validateNewPass = (rule, value, callback) => {
      if (this.settingFormData.password) {
        if (value === this.settingFormData.password) {
          callback(new Error("新旧密码不能相同"))
          return
        }
      }
      callback()
    }
    const validatePassAgain = (rule, value, callback) => {
      if (!this.settingFormData.newPassword) {
        callback()
      }
      if (value !== this.settingFormData.newPassword) {
        callback(new Error("两次密码不相同"))
        return
      }
      callback()
    }
    return {
      showArrow: true,
      settingFormData: {
        username: '',
        phone: 0,
        avatar: '',
        password: '',
        newPassword: '',
        passagain: ''
      },
      ruleValidate: {
        username: [
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { validator: validatePassword, trigger: "blur" }
        ],
        newPassword: [
          { validator: validateNewPass, trigger: "blur" }
        ],
        passagain: [
          { validator: validatePassAgain, trigger: "blur" }
        ] 
      }
    }
  },
  methods: {
    gotoBottom() {
      document.getElementsByClassName('personal')[0].scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
      this.showArrow = false
    },
    initUser() {
      const { username, phone, avatar } = this.$store.getters.getUser
      this.settingFormData.username = username
      this.settingFormData.phone = phone
      this.settingFormData.avatar = avatar
      this.settingFormData.password = '' 
      this.settingFormData.newPassword = '' 
      this.settingFormData.passagain = ''
    },
    // 校验表单
    validForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success("提交成功!")
          this.updateUser()
        } else {
          this.$Message.error("表单验证失败！")
        }
      })
    },
    async updateUser(){
      const { settingFormData } = this
      settingFormData._id = this.$store.state.objectId
      await updateUser(settingFormData).then(res => {
        if (res.data.err_code === 0) {
          this.$store.dispatch('saveUser', res.data.data)
          this.$Message.success(res.data.message)
          this.$router.replace('/')
          return
        }
        this.$Message.error(res.data.message)
      })
    },
    // 接收上传子组件传过来的值
    getImageUrl(val) {
      this.settingFormData.avatar = val
    }
  },
  mounted() {
    this.initUser()
    setTimeout(() => {
      this.gotoBottom()
    }, 3000)
  }
}
</script>

<style lang="less">
.personal-top{
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
.personal-downArrow{
  width: 100%;
  height: 2rem;
  background: #CDCDCD;
  cursor: pointer;
  img{
    height: 1.333333rem;
  }
}
.personal-downArrow:hover{
  background: #C0C0C0;
}
.personal-content{
  width: 100%;
  height: 100vh;
  font-family: kxzdt;
  img{
    height: auto;
    width: 2.666667rem;
    border-radius: 50%;
  }
  .personal-form{
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
  button{
    height: 1rem;
    width: 2.4rem;
    margin: .3rem .4rem 0 0;
    font-size: .32rem;
  }
}
</style>
