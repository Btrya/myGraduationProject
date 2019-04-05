<template>
<div class="foundList animated bounceInUp delay-1s">
  <Divider>招领信息</Divider>
  <div v-if="list.length > 0" class="foundList-list f-column">
    <div v-for="(item, index) in list" :key="index" @click="sendArticleId(item._id)">
      <Card :padding="10" style="width: 100%;">
        <div class="foundList-item f-vertical">
          <img v-if="item.imageUrl !== ''" mode="widthFix" :src="item.imageUrl" alt=""/>
          <img v-else mode="widthFix" src="../images/no-pic.jpg" alt=""/>
          <div class="f-column foundList-item-text">
            <div class="f-flex-start"><Icon type="ios-clock" size="25"/><div class="f-column"><p>发生时间：{{item.time_quantum[0]}}</p><p class="foundList-timeText">至{{item.time_quantum[1]}}</p></div></div>
            <div class="f-flex-start"><Icon type="ios-filing" size="25"/><p>寻找物品：{{item.product}}</p></div>
            <div class="f-flex-start"><Icon type="md-pin" size="25"/><p>地点：{{item.place}}</p></div>
            <div class="f-flex-start"><Icon type="ios-list-box" size="25"/><p>描述：{{item.content}}</p></div>
          </div>
        </div>
      </Card>
    </div>
  </div>
  <div v-else class="foundList-none f-center">
    暂无数据
  </div>
</div>
</template>

<script>
export default {
  props: {
    carouselImgs: {
      type: Array
    },
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      current: 0
    }
  },
  methods: {
    sendArticleId(id) {
      this.$emit('getArticle', id)
    }
  },
  mounted() {
    
  }
}
</script>

<style scoped lang="less">
.ivu-divider-horizontal.ivu-divider-with-text-center, .ivu-divider-horizontal.ivu-divider-with-text-left, .ivu-divider-horizontal.ivu-divider-with-text-right{
  font-family: kxzdt;
  font-size:26px;
}
.foundList{
  width: 100%;
  margin: 20px 30px;
}
.foundList-list{
  margin-top: 30px;
  .ivu-card-bordered{
    margin-bottom: .133333rem;
    cursor: pointer;
  }
}
.foundList-item{
  // background: #f8f8f9;
  min-height: 2rem;
  // margin-bottom: 20px;
  img{
    margin: .266667rem .4rem;
    width: 1.733333rem;
    height: auto;
    background-color: #f6f6f6;
  }
  p{
    margin-left: 8px;
    font-size:16px;
  }
}
.foundList-timeText{
  margin-left: 1.3rem !important;
}
.foundList-item-text{
  max-width: 64%;
}
.foundList-none{
  width: 100%;
  height: 5.333333rem;
  font-size: .8rem;
  font-family: kxzdt;
}
</style>
