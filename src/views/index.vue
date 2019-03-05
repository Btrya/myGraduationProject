<template>
  <div class="index">
    <navBar></navBar>
    <div class="bodyright">
      <carousel v-bind:carouselImgs="carouselImgs"></carousel>
      <div class="bodyright-content">
        <foundList :list.sync="foundData"></foundList>
        <loseList :list.sync="loseData"></loseList>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "../components/navBar";
import carousel from "../components/carousel";
import foundList from "../components/foundList";
import loseList from "../components/loseList";
import { getIndexArticle } from '../apis/article.js'
export default {
  data() {
    return {
      carouselImgs: [
        "http://www.lostandfound.cn/attachment/201811/13/1542077977_HffFG1_cb.jpg",
        "http://www.lostandfound.cn/attachment/201811/13/1542077977_HffFG1_cb.jpg",
        "http://www.lostandfound.cn/attachment/201811/13/1542077977_HffFG1_cb.jpg"
      ],
      foundData: [],
      loseData: []
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
      const that = this
      await getIndexArticle().then(res => {
        if (res.data.err_code === 0) {
          let { loseData, foundData } = res.data.data
          that.foundData = foundData
          that.loseData = loseData
        }
      })
    }
  },
  mounted() {
    this.getIndexArticle()
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
</style>
