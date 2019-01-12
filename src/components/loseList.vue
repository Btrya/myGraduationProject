<template>
<div class="loseList">
  <Divider>寻物信息</Divider>
  <div class="loseList-list f-column">
      <div v-for="item in 6" class="loseList-item f-vertical">
        <img mode="widthFix" src="" alt="">
        <div class="f-column loseList-item-text">
          <div class="f-flex-start"><Icon type="ios-clock" size="25"/><p>发生时间：2018-12-16</p></div>
          <div class="f-flex-start"><Icon type="ios-filing" size="25"/><p>寻找物品：水杯</p></div>
          <div class="f-flex-start"><Icon type="ios-call" size="25"/><p>联系电话：11111111111111</p></div>
          <div class="f-flex-start"><Icon type="ios-list-box" size="25"/><p>物品详情：白色的水杯白色的水杯白色的水杯白色的水杯白色的水杯白色的水杯白色的水杯白色的水杯</p></div>
        </div>
      </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    carouselImgs: {
      type: Array
    }
  },
  data() {
    return {
      current: 0
    }
  },
  created() {
    
  }
}
</script>

<style scoped lang="less">
.ivu-divider-horizontal.ivu-divider-with-text-center, .ivu-divider-horizontal.ivu-divider-with-text-left, .ivu-divider-horizontal.ivu-divider-with-text-right{
  font-family: kxzdt;
  font-size:26px;
}
.loseList{
  width: 100%;
  margin: 20px 30px;
}
.loseList-list{
  margin-top: 30px;
}
.loseList-item{
  background: #f0f0f4;
  min-height: 150px;
  margin-bottom: 20px;
  img{
    margin: 20px 30px;
    width:100px;
    height: 100px;
    background-color: cornflowerblue;
  }
  p{
    margin-left: 8px;
    font-size:16px;
  }
}
.loseList-item-text{
  max-width: 64%;
}
</style>
