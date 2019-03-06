<template>
  <div class="information f-center f-column">
    <div class="information-top f-center animated lightSpeedIn">
      <img mode="widthFix" src="../images/info-banner.jpg"/>
      <h1 v-if="articleType === 'found'">招领讯息</h1>
      <h1 v-if="articleType === 'lose'">寻物讯息</h1>
    </div>
    <div v-if="articleList.length > 0" class="information-content f-column animated lightSpeedIn delay-1s">
      <Collapse simple accordion>
        <Panel v-for="(item, index) in articleList" :key="index" :name="item._id">
          于<span>{{item.time_quantum[0]}}</span> - <span>{{item.time_quantum[1]}}</span>在<span>{{item.place}}</span>{{typeText}}<span>{{item.product}}</span>
          <div slot="content" class="information-modal f-column">
            <div><span>发布人：</span>{{item.username}}</div>
            <div><span>物品：</span>{{item.product}}</div>
            <div><span>地点：</span>{{item.place}}</div>
            <div class="f-vertical">
              <span>图片：</span>
              <img v-if="item.imageUrl !== ''" mode="widthFix" :src="item.imageUrl"/>
              <img v-else mode="widthFix" src="../images/no-pic.jpg"/>
            </div>
            <div><span>描述：</span>{{item.content}}</div>
            <div><span>联系方式：</span>{{item.contact[0]}}{{item.contact[1]}}</div>
            <div><span>时间：</span>{{item.time_quantum[0]}} - {{item.time_quantum[1]}}</div>
          </div>
        </Panel>
      </Collapse>
      <div class="information-pager f-center"><Page :total="total" show-total show-elevator @on-change="changePageNum"/></div>
    </div>
    <div v-else class="information-none f-center animated lightSpeedIn delay-1s">
      <Divider>暂无数据</Divider>
    </div>
  </div>
</template>

<script>
import { getArticle } from "../apis/article.js";
export default {
  data() {
    return {
      articleType: '',
      typeText: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      articleList: []
    };
  },
  methods: {
    // 获取文章列表
    async getArticle() {
      const { articleType, pageNum, pageSize } = this;
      const data = { articleType, pageNum, pageSize };
      const that = this;
      await getArticle(data).then(res => {
        if (res.data.err_code === 0) {
          that.total = res.data.data.total
          that.articleList = res.data.data.data
        }
      });
    },
    // 切换页码
    changePageNum(val) {
      this.pageNum = val
      this.getArticle()
    }
  },
  mounted() {
    this.articleType = this.$route.query.articleType
    this.typeText = this.articleType === 'found' ? '拾获' : '遗失'
    this.getArticle()
  }
};
</script>

<style lang="less">
.information-top{
  line-height: 0;
  img{
    width: 100%;
    height: auto;
  }
  h1{
    position: absolute;
    font-size: 2.4rem;
    font-family: kxzdt;
    color: #333;
  }
}
.information-content{
  margin: .266667rem 0 .666667rem;
  width: 80%;
  font-size: .32rem;
  font-family: kxzdt;
  .ivu-collapse-header{
    height: .933333rem !important;
    line-height: .933333rem !important;
  }
  .information-pager{
    margin-top: .4rem;
    width: 100%;
  }
  .ivu-collapse-header span{
    color: #ff9900;
  }
}
.information-modal{
  font-family: kxzdt;
  font-size: .373333rem;
  margin: 0 0 0 23%;
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
.information-none{
  width: 100%;
  height: 6rem;
  span{
    font-size: 1.066667rem;
    font-family: kxzdt;
  }
}
</style>
