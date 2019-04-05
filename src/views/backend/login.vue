<template>
  <div class="backend-login">
    <div class="backend-login-box">
      <div class="backend-login-text f-center">欢迎登录，管理员</div>
      <i-form ref='loginForm' :model="loginFormData" label-position="top">
        <Form-item label="管理员账号" prop="username">
          <i-input v-model="loginFormData.username" placeholder="请输入管理员账号"></i-input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <i-input type="password" v-model="loginFormData.password" placeholder="请输入密码"></i-input>
        </Form-item>
        <Form-item>
          <i-button class="login-submit" type="info" @click="login">登录</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import { login } from '../../apis/login.js'
export default {
  data() {
    return {
      loginFormData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录
    async login() {
      // 获取表单数据
      const { loginFormData } = this
      // 提交到后台
      await login(loginFormData).then(res => {
        // 后台返回成功
        if (res.data.err_code === 0) {
          // 保存登录态
          this.$store.dispatch('saveUser', res.data.data)
          this.$Message.success("登录成功!")
          this.$router.push({path: '/'})
          return
        }
        // 失败提示
        this.$Message.error(res.data.message)
      })
    }
  }
}
</script>
<style lang="less">
.backend-login{
  height: 100vh;
  width: 100%;
  background: url('../../images/back-bg.jpg') no-repeat;
  background-size:100% 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  .backend-login-text{
    margin-top: .266667rem;
    font-size: .426667rem;
    font-family: kxzdt;
  }
  .backend-login-box{
    min-width: 0 !important;
    width: 8rem;
    min-height: 4rem;
    background-color: rgba(240, 240, 244, 0.6);
    margin: 1.333333rem 2.6rem;
    border-radius: .133333rem;
    z-index: 2;
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
  .login-submit{
    width: 100%;
    height: 1.306667rem;
    font-size: .533333rem;
  }
}
</style>
