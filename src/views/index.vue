<template>
  <div class="index">
    <navBar></navBar>
    <div class="bodyright">
      <carousel v-bind:carouselImgs="carouselImgs"></carousel>
      <div class="bodyright-content">
        <foundList :list.sync="foundData" v-on:getArticle="getArticle"></foundList>
        <loseList :list.sync="loseData" v-on:getArticle="getArticle"></loseList>
      </div>
    </div>
    <Modal v-model="articleModal" width="40%">
      <p slot="header" style="color:#2b85e4;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{articleData.articleType}}</span>
      </p>
      <div class="index-modal f-column">
        <div><span>发布人：</span>{{articleData.username}}</div>
        <div><span>物品：</span>{{articleData.product}}</div>
        <div><span>地点：</span>{{articleData.place}}</div>
        <div class="f-vertical">
          <span>图片：</span>
          <img v-if="articleData.imageUrl !== ''" mode="widthFix" :src="articleData.imageUrl"/>
          <img v-else mode="widthFix" src="../images/no-pic.jpg"/>
        </div>
        <div><span>描述：</span>{{articleData.content}}</div>
        <div><span>联系方式：</span>{{articleData.contact[0]}}{{articleData.contact[1]}}</div>
        <div><span>时间：</span>{{articleData.time_quantum[0]}} - {{articleData.time_quantum[1]}}</div>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long @click="articleModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import navBar from "../components/navBar";
import carousel from "../components/carousel";
import foundList from "../components/foundList";
import loseList from "../components/loseList";
import { getIndexArticle, getArticleById } from "../apis/article.js";
export default {
  data() {
    return {
      carouselImgs: [
        "http://www.lostandfound.cn/attachment/201811/13/1542077977_HffFG1_cb.jpg",
        "http://www.lostandfound.cn/attachment/201811/13/1542077977_HffFG1_cb.jpg",
        "http://www.lostandfound.cn/attachment/201811/13/1542077977_HffFG1_cb.jpg"
      ],
      foundData: [],
      loseData: [],
      articleModal: false,
      articleData: {
        contact: ['手机号', ''],
        product: '',
        articleType: '招领启事',
        content: '',
        imageUrl: '',
        username: '',
        userId: '',
        time_quantum: ['', '']
      }
    };
  },
  components: {
    navBar,
    carousel,
    foundList,
    loseList
  },
  methods: {
    async getIndexArticle() {
      const that = this;
      await getIndexArticle().then(res => {
        if (res.data.err_code === 0) {
          let { loseData, foundData } = res.data.data;
          that.foundData = foundData;
          that.loseData = loseData;
        }
      });
    },
    // 点击获取文章id，然后根据id去查找对应的文章
    getArticle(id) {
      const data = { id }
      const that = this
      getArticleById(data).then(res => {
        if (res.data.err_code === 0) {
          that.articleData = res.data.data
          that.articleData.articleType = that.articleData.articleType === 'found' ? '招领启事' : '寻物启事'
          that.articleModal = true
        }
      })
    }
  },
  mounted() {
    this.getIndexArticle();
  }
};
</script>

<style lang="less" scoped>
.bodyright {
  float: right;
  width: 82.1%;
}
.bodyright-content {
  width: 100%;
  display: flex;
  justify-content: center;
}
.index-modal{
  font-family: kxzdt;
  font-size: .373333rem;
  div{
    display: flex;
    align-items: center;
  }
  span{
    font-weight: bold;
    width: 2rem;
    display: flex;
    justify-content: space-around;
  }
  img{
    width: 2.666667rem;
    height: auto;
  }
}
</style>
