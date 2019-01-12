<template>
<div class="navBar">
  <div class="navBar-logo">
      <img mode="widthFix" src="../images/logoko.png" alt="Logo">
  </div>
  <div class="navBar-login"><Icon type="md-contact" size="22" /><router-link to="/login">登录</router-link> | <router-link to="/register">注册</router-link></div>
  <div class="navBar-menu f-column">
      <span>首页</span>
      <span>首页</span>
      <span>首页</span>
      <span>首页</span>
  </div>
</div>
</template>

<script>
export default {

}
</script>

<style scoped lang="less">
.navBar{
    min-height: 100vh;
    width: 17.75%;
    position: fixed;
    max-width: 340px;
    min-width: 236px;
    left: 0;
    top: 0;
    background-color: #FFF;
    z-index: 99;
}
.navBar-logo{
    margin: 76px auto 0;
    img{
        width: 100%;
    }
}
.navBar-login{
    font-size:16px;
    margin: 46px 10% 0;
    font-family: kxzdt;
    a{
        color: #515a61;
    }
}
.navBar-menu{
    font-size:18px;
    margin: 26px 10% 0;
    font-family: kxzdt;
}
</style>
