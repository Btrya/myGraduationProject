<template>
  <div class="login f-center">
    <div class="login-box">
      <i-form v-ref:loginForm :model="loginFormData" :rules="ruleValidate" :label-width="80">
        <Form-item label="用户名" prop="username">
          <i-input :value.sync="loginFormData.username" placeholder="请输入用户名"></i-input>
        </Form-item>
        <Form-item label="手机号" prop="phone">
          <i-input :value.sync="loginFormData.phone" placeholder="请输入手机号"></i-input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <i-input :value.sync="loginFormData.password" placeholder="请输入密码"></i-input>
        </Form-item>
        <Form-item>
          <i-button type="primary" @click="handleSubmit('loginForm')">提交</i-button>
          <i-button type="ghost" @click="handleReset('loginForm')" style="margin-left: 8px">重置</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFormData: {
        username: "",
        password: '',
        phone: ''
      },
      ruleValidate: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "phone", message: "邮箱格式不正确", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("提交成功!");
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-color: #f0f0f4;
}
.login-box {
  min-width: 0 !important;
  width: 500px;
  min-height: 300px;
  background-color: cornflowerblue;
  margin-bottom: 100px;
}
</style>
