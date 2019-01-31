<template>
  <div id="login" class="login f-center">
    <div class="login-box">
      <i-form ref='loginForm' :model="loginFormData" :rules="ruleValidate" label-position="top">
        <Form-item label="用户名" prop="username">
          <i-input v-model="loginFormData.username" placeholder="请输入用户名或手机号"></i-input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <i-input type="password" v-model="loginFormData.password" placeholder="请输入密码"></i-input>
        </Form-item>
        <Form-item>
          <i-button class="login-submit" type="success" @click="handleSubmit('loginForm')">登录</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import particles from 'particles.js'
import { login } from '../apis/login.js'
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
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"))
        return
      }
      callback()
    }
    return {
      loginFormData: {
        username: "",
        password: ""
      },
      ruleValidate: {
        username: [
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { validator: validatePass, trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("提交成功!")
          this.login()
        } else {
          this.$Message.error("表单验证失败!")
        }
      })
    },
    // 登录
    async login() {
      const { loginFormData } = this
      await login(loginFormData).then(res => {
        console.log(res)
      })
    }
  },
  mounted(){
    particlesJS.load('login','src/styles/particles.json')
  }
}
</script>

<style lang="less">
.login{
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
.login {
  width: 100%;
  height: 100vh;
  background: url('../images/loginBg.jpg') no-repeat;
  background-size:100% 100%;
}
.login-box {
  min-width: 0 !important;
  width: 8rem;
  min-height: 4rem;
  background-color: rgba(240, 240, 244, 0.6);
  margin-bottom: 1.333333rem;
  border-radius: .133333rem;
  z-index: 2;
}
.login-submit{
  width: 100%;
  height: 1.306667rem;
  font-size: .533333rem;
}
</style>

