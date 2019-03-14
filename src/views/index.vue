<template>
  <div class="index">
    <navBar v-on:getSearchVal="getSearchVal"></navBar>
    <div class="bodyright">
      <carousel v-bind:carouselImgs="carouselImgs"></carousel>
      <div class="bodyright-content">
        <foundList :list.sync="foundData" v-on:getArticle="getArticle"></foundList>
        <loseList :list.sync="loseData" v-on:getArticle="getArticle"></loseList>
      </div>
    </div>
    <!-- 弹出框 -->
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
    <!-- 抽屉 -->
    <Drawer :closable="false" width="50%" v-model="showDrawer">
      <div class="index-drawer f-column">
        <Divider orientation="left">筛选搜索：</Divider>
        <div class="f-vertical f-space-around">
          <RadioGroup v-model="searchData.articleType" type="button"  @on-change="changeRadio">
            <Radio label="招领启事"></Radio>
            <Radio label="寻物启事"></Radio>
          </RadioGroup>
          <Input v-model="searchData.product" search placeholder="键入物品名搜索讯息" @on-search="searchArticle" style="width:50%;"/>
        </div>
        <Divider orientation="left">结果：</Divider>
        <div v-if="searchList.length > 0" class="drawer-content f-column">
          <Collapse simple accordion>
            <Panel v-for="(item, index) in searchList" :key="index" :name="item._id">
              于<span>{{item.time_quantum[0]}}</span> - <span>{{item.time_quantum[1]}}</span>在<span>{{item.place}}</span>{{searchData.typeText}}<span>{{item.product}}</span>
              <div slot="content" class="drawer-modal f-column">
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
          <div class="drawer-pager f-center"><Page :total="searchData.total" show-total show-elevator @on-change="changePageNum"/></div>
        </div>
        <div v-else class="drawer-none f-center">
          <Divider>暂无数据</Divider>
        </div>
      </div>
    </Drawer>
    <!-- 搜索半圆1 -->
    <div class="drawer-searchBtn" @mouseenter="searchBtn = false" @mouseleave="searchBtn = true" @click="showDrawer = false">
      <img v-show="searchBtn" mode="widthFix" src="../images/icon-search.png">
      <img v-show="!searchBtn" mode="widthFix" src="../images/icon-right.png">
    </div>
    <!-- 搜索半圆2 -->
    <div v-show="!showDrawer" class="drawer-searchBtn2" @mouseenter="searchBtn = false" @mouseleave="searchBtn = true" @click="openDrawer">
      <img v-show="searchBtn" mode="widthFix" src="../images/icon-search.png">
      <img v-show="!searchBtn" mode="widthFix" src="../images/icon-left.png">
    </div>
  </div>
</template>

<script>
import navBar from "../components/navBar";
import carousel from "../components/carousel";
import foundList from "../components/foundList";
import loseList from "../components/loseList";
import { getIndexArticle, getArticleById, getArticle } from "../apis/article.js";
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
      },
      showDrawer: false,
      searchData: {
        product: '',
        articleType: '招领启事',
        pageNum: 1,
        pageSize: 5,
        total: 0,
        typeText: '拾获'
      },
      searchList: [],
      // 搜索按钮
      searchBtn: true
    };
  },
  components: {
    navBar,
    carousel,
    foundList,
    loseList
  },
  methods: {
    // 获取首页信息
    async getIndexArticle() {
      const that = this
      await getIndexArticle().then(res => {
        if (res.data.err_code === 0) {
          let { loseData, foundData } = res.data.data
          that.foundData = foundData
          that.loseData = loseData
        }
      })
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
    },
    // 获取搜索框传过来的值
    getSearchVal(val) {
      this.searchData.product = val
      this.showDrawer = true
      this.searchArticle()
    },
    // 搜索
    async searchArticle() {
      // 获取表单数据
      const { articleType, pageNum, pageSize, product } = this.searchData
      const temp = articleType === '招领启事' ? 'found' : 'lose'
      const formdata = { articleType: temp, pageNum, pageSize, product }
      // 传入后台
      await getArticle(formdata).then(res => {
        // 返回成功
        if (res.data.err_code === 0) {
          const { data, pageNum, pageSize, total } = res.data.data
          this.searchData.total = total
          this.searchData.pageNum = pageNum
          this.searchData.pageSize = pageSize
          this.searchList = data
        }
      })
    },
    // 切换筛选类别
    changeRadio(val) {
      this.searchData.articleType = val
      this.searchData.pageNum = 1
      this.searchData.typeText = val === '招领启事' ? '拾获' : '遗失'
      this.searchArticle()
    },
    // 切换页码
    changePageNum(val) {
      this.searchData.pageNum = val
      this.searchArticle()
    },
    // 插入dom树
    appendSearchBtn() {
      let btn = document.getElementsByClassName('drawer-searchBtn')[0]
      let father = document.getElementsByClassName('ivu-drawer')[0]
      father.appendChild(btn)
    },
    openDrawer() {
      this.showDrawer = true
      this.searchArticle()
    }
  },
  mounted() {
    this.getIndexArticle()
    this.appendSearchBtn()
  }
};
</script>

<style lang="less">
.bodyright {
  float: right;
  width: 84.1%;
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
.index-drawer {
  font-family: kxzdt;
  span{
    font-family: kxzdt !important;
  }
}
.drawer-content{
  margin: .266667rem 0 .666667rem;
  width: 100%;
  font-size: .32rem;
  font-family: kxzdt;
  .ivu-collapse-header{
    height: auto !important;
    min-height: .933333rem !important;
    line-height: .933333rem !important;
  }
  .drawer-pager{
    margin-top: .4rem;
    width: 100%;
  }
  .ivu-collapse-header span{
    color: #ff9900;
  }
  .drawer-modal{
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
}

// 搜索按钮的骚操作
.ivu-drawer-content{
  z-index: 1003;
}
.drawer-searchBtn{
  z-index: 1001;
  position: absolute;
  bottom: 4rem;
  left: -50px;
  width: 110px;
  height: 100px;
  background: rgba(92, 173, 255, 0.6);
  border-radius: 50%;
  img{
    cursor: pointer;
    height: auto;
    width: .533333rem;
    position: relative;
    top: 35%;
    left: .24rem;
  }
}
.drawer-searchBtn2{
  z-index: 1001;
  position: fixed;
  bottom: 4rem;
  right: -60px;
  width: 110px;
  height: 100px;
  background: rgba(92, 173, 255, 0.6);
  border-radius: 50%;
  img{
    cursor: pointer;
    height: auto;
    width: .533333rem;
    position: relative;
    top: 35%;
    left: .24rem;
  }
}
.drawer-searchBtn:hover{
  left: -55px !important;
}
.drawer-searchBtn2:hover{
  right: -55px !important;
}
</style>
