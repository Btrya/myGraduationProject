<template>
  <div id="register" class="register f-center">
    <div class="register-box">
      <i-form ref='registerForm' :model="registerFormData" :rules="ruleValidate" label-position="top">
        <Form-item label="用户名" prop="username">
          <i-input v-model="registerFormData.username" placeholder="请输入用户名"></i-input>
        </Form-item>
        <Form-item label="手机号" prop="phone">
          <i-input v-model="registerFormData.phone" placeholder="请输入手机号"></i-input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <i-input type="password" v-model="registerFormData.password" placeholder="请输入密码"></i-input>
        </Form-item>
        <Form-item label="重复密码" prop="passagain">
          <i-input type="password" v-model="registerFormData.passagain" placeholder="请再次输入密码"></i-input>
        </Form-item>
        <Form-item>
          <i-button class="register-submit" type="success" @click="handleSubmit('registerForm')">注册</i-button>
          <p class="register-msg">已有账号?去<router-link to="/login">登录</router-link></p>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import particles from 'particles.js'
import { register } from '../apis/login.js'
export default {
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
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"))
        return
      }
      if(!(/^1[34578]\d{9}$/.test(value))){ 
        callback(new Error("手机号码有误，请重填"))
        return 
      } 
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"))
        return
      }
      callback()
    }
    const validatePassAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"))
        return
      }
      if (value !== this.registerFormData.password) {
        callback(new Error("两次密码不相同"))
        return
      }
      callback()
    }
    return {
      registerFormData: {
        username: '',
        password: '',
        phone: '',
        passagain: ''
      },
      ruleValidate: {
        username: [
          { validator: validateUsername, trigger: "blur" }
        ],
        phone: [
          { validator: validatePhone, trigger: "blur" }
        ],
        password: [
          { validator: validatePass, trigger: "blur" }
        ],
        passagain: [
          { validator: validatePassAgain, trigger: "blur" }
        ],       
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success("提交成功!")
          this.register()
        } else {
          this.$Message.error("表单验证失败!")
        }
      })
    },
    // 注册
    async register() {
      // 获取表单数据
      const { registerFormData } = this
      // 发送到后台
      await register(registerFormData).then(res => {
        // 后台成功返回数据
        if (res.data.err_code === 0) {
          // 保存状态
          this.$store.dispatch('saveUser', res.data.data)
          this.$Message.success("注册成功!")
          this.$router.push({path: '/'})
          return
        }
        // 失败提示
        this.$Message.error(res.data.message)
      })
    }
  },
  mounted(){
    particlesJS.load('register','src/styles/particles.json')
  }
}
</script>

<style lang="less">
.register{
  .particles-js-canvas-el{
    position: absolute;
    z-index: 1;
  }
  .ivu-form{
    margin: .666667rem .533333rem;
  }
  .ivu-form-label-top .ivu-form-item-label{
    font-family: kxzdt;
    font-size: .426667rem !important;
  }
  .ivu-form-item-content {
    font-family: kxzdt;
  }
  .ivu-input{
    height: 1.066667rem !important;
    padding: .266666rem .266666rem !important;
    font-size: .426666rem !important;
  }
  .ivu-form-item-error-tip{
    font-size: .3rem !important; 
  }
}
</style>
<style lang="less" scoped>
.register {
  width: 100%;
  height: 100vh;
  background: url('../images/loginBg.jpg') no-repeat;
  background-size:100% 100%;
}
.register-box {
  min-width: 0 !important;
  width: 8rem;
  min-height: 4rem;
  background-color: rgba(240, 240, 244, 0.6);
  margin-bottom: 1.333333rem;
  border-radius: .133333rem;
  z-index: 2;
}
.register-submit{
  width: 100%;
  height: 1.306667rem;
  font-size: .533333rem;
}
.register-msg{
  font-size: .346667rem;
}
</style>
