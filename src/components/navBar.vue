<template>
  <div class="navBar animated bounceInLeft fast">
    <div class="navBar-logo">
      <img mode="widthFix" src="../images/logoko.png" alt="Logo">
    </div>
    <div v-if="username === ''" class="navBar-login f-center">
      <Icon type="md-contact" size="22"/>
      <router-link to="/login">登录</router-link>|
      <router-link to="/register">注册</router-link>
    </div>
    <div v-else class="navBar-user f-vertical">
      <img mode="widthFix" :src="avatar" alt="avatar" @click="gotoSetting"/>
      <div class="f-column">
        <span>{{username}}</span>
        <a @click="quitLogin">退出登录</a>
      </div>
    </div>
    <div class="navBar-menu f-center f-column">
      <router-link to="/">首页</router-link>
      <router-link to="/publish">发布</router-link>
      <router-link to="/personal">个人中心</router-link>
      <router-link :to="{path:'/information', query:{articleType: 'found'}}">更多招领</router-link>
      <router-link :to="{path:'/information', query:{articleType: 'lose'}}">更多寻物</router-link>
      <router-link v-if="username !== ''" to="/myArticle">我发布的</router-link>
    </div>
    <div class="navBar-search f-center">
      <Input v-model="searchVal" search placeholder="键入物品名搜索讯息" @on-search="searchArticle"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      avatar: '',
      // 搜索词
      searchVal: ''
    }
  },
  methods: {
    initUser() {
      const { username, avatar } = this.$store.getters.getUser
      this.username = username
      this.avatar = avatar
    },
    quitLogin() {
      this.$store.dispatch('clearUser')
      this.initUser()
      this.$Message.success("退出登录")
    },
    gotoSetting() {
      this.$router.push({path: '/personal'})
    },
    searchArticle(val) {
      this.$emit('getSearchVal', val)
      this.searchVal = ''
    }
  },
  mounted() {
    this.initUser()
  }
};
</script>

<style scoped lang="less">
.navBar {
  min-height: 100vh;
  // width: 17.75%;
  position: fixed;
  max-width: 4.666667rem;
  min-width: 4.266667rem;
  left: 0;
  top: 0;
  background-color: #fff;
  z-index: 99;
  border-right: 1px solid #f6f6f6;
}
.navBar-logo {
  margin: 1.013333rem auto 0;
  img {
    width: 100%;
  }
}
.navBar-login {
  font-size: 16px;
  margin: .613333rem 10% 0;
  font-family: kxzdt;
  a {
    color: #515a61;
  }
  i {
    margin-bottom: 0;
  }
}
.navBar-menu {
  font-size: .346667rem;
  margin: .346667rem 10% 0;
  font-family: kxzdt;
  a {
    color: #515a61;
  }
}
.navBar-user{
  margin: .346667rem 10% 0;
  img {
    border-radius: 50%;
    height: 1.066667rem;
  }
  div {
    font-family: kxzdt;
    font-size: .346667rem;
    margin-left: .266667rem
  }
  a {
    color: #515a61;
  }
  a:hover {
    color: #515a61;
  }
}
.navBar-search{
  padding: 0 .266667rem;
  width: 100%;
  position: absolute;
  bottom: 1.066667rem;
}
</style>
