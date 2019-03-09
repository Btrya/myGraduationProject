<template>
  <div class="myArticle">
    <div class="myArticle-top f-center animated lightSpeedIn">
      <img mode="widthFix" src="../images/myart-banner.jpg"/>
      <h1>我发布的</h1>
    </div>
    <div class="myArticle-content f-column">
      <div class="f-vertical">
        <span>筛选类别：</span>
        <RadioGroup v-model="articleType" type="button" @on-change="changeRadio">
          <Radio label="招领启事"></Radio>
          <Radio label="寻物启事"></Radio>
        </RadioGroup>
      </div>
      <div v-if="total > 0" class="f-column margin-top-10">
        <span>发布的信息：(点击对应卡片编辑)</span>
        <div class="f-vertical f-wrap margin-top-10">
          <div v-for="(item, index) in articleList" :key="index" @click="editCard(item._id)">
            <Card style="width: 320px;">
              <img mode="widthFix" src="../images/icon-delete.png" @click.stop="confirmDelCard(item._id)"/>
              于<span>{{item.time_quantum[0]}}</span> - <span>{{item.time_quantum[1]}}</span>在<span>{{item.place}}</span>{{typeText}}<span>{{item.product}}</span>
            </Card>
          </div>
        </div>
        <div class="myArticle-pager f-center"><Page :total="total" :page-size="pageSize" show-total show-elevator @on-change="changePageNum"/></div>
      </div>
      <div v-else class="myArticle-none f-center animated jackInTheBox fast">
        <Divider>暂无数据</Divider>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <Modal v-model="articleModal" width="70%" :styles="{top: '20px'}">
      <p slot="header" style="color:#2b85e4;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>编辑{{articleType}}</span>
      </p>
     <i-form class="myArticle-form" ref='myArticleForm' :model="articleData" :rules="ruleValidate" label-position="left" :label-width="130">
        <Form-item label="讯息类型:" prop="articleType">
          <RadioGroup v-model="articleData.articleType" type="button">
            <Radio label="招领启事"></Radio>
            <Radio label="寻物启事"></Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="物品:" prop="product">
          <i-input v-model="articleData.product" placeholder="请输入找到/丢失的物品"></i-input>
        </Form-item>
        <Form-item label="地点:" prop="place">
          <i-input v-model="articleData.place" placeholder="请输入找到/丢失物品时候的地点"></i-input>
        </Form-item>
        <Form-item class="publish-timeQuantum" label="发生时间段:" prop="time_quantum">
          <DatePicker v-model="articleData.time_quantum" :options="options" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择发生时间段" size="large" style="width: 60%;" @on-change="changeTimeQuantum"></DatePicker>
        </Form-item>
        <Form-item label="联系方式:" prop="contact">
          <div class="f-vertical">
            <Select v-model="articleData.contact[0]" size="large" @on-change="changeContact" style="width:200px">
                <Option v-for="item in contactOptions" :value="item.value" :key="item.value" :label="item.value"></Option>
            </Select>
            <i-input v-model="articleData.contact[1]" placeholder="请输入联系方式"></i-input>
          </div>
        </Form-item>
        <Form-item class="publish-editor" label="描述:" prop="content">
          <mavonEditor ref="myArticleEditor" :content.sync="articleData.content" v-on:updateContent="updateContent"></mavonEditor>
        </Form-item>
      </i-form>
      <div slot="footer">
        <Button type="info" size="large" @click="validForm('myArticleForm')">编辑</Button>
        <Button size="large" @click="articleModal = false">关闭</Button>
      </div>
    </Modal>
    <!-- 删除弹出框 -->
    <Modal v-model="delModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确认删除该文章吗？</span>
      </p>
      <div style="text-align:center">
        <p>确认删除该文章后，文章不可恢复。</p>
        <p>真的要删除该文章吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" :loading="modal_loading" @click="delCard">确认</Button>
        <Button size="large" @click="delModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getArticle, getArticleById, update, deleteById } from "../apis/article.js";
import mavonEditor from "../components/mavon"
export default {
  components: {
    mavonEditor
  },
  data() {
    const validateContact = (rule, value, callback) => {
      if (!value[1]) {
        callback(new Error("联系方式不能为空"))
        return
      }
      if (value[0] === '手机号') {
        if(!(/^1[34578]\d{9}$/.test(value[1]))){ 
          callback(new Error("手机号码有误，请重填"))
          return 
        }
      } else if (value[0] === '邮箱') {
        if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value[1]))){ 
          callback(new Error("邮箱格式有误，请重填"))
          return 
        }
      }
      callback()
    }
    const validateTime = (rule, value, callback) => {
      if (!value[1]) {
        callback(new Error("时间段异常，请重新选择"))
        return
      }
      callback()
    }
    const validateRequired = (rule, value, callback) => {
      if (!value) {
        callback(new Error("此项为必填项"))
        return
      }
      callback()
    }
    return {
      userId: '', // 用户id
      articleType: '招领启事', // 选择的类型
      pageNum: 1, // 页码
      pageSize: 12, // 每页显示条数
      articleList: [], // 文章列表
      total: 0, // 总数
      typeText: '拾获',
      articleData: {
        _id: '',
        contact: ['手机号', ''],
        product: '',
        place: '',
        articleType: '招领启事',
        content: '',
        imageUrl: '',
        username: '',
        userId: '',
        time_quantum: ['', '']
      },
      ruleValidate: {
        product: [
          { validator: validateRequired, trigger: "blur" }
        ],
        contact: [
          { validator: validateContact, trigger: "blur" }
        ],
        place: [
          { validator: validateRequired, trigger: "blur" }
        ],
        time_quantum: [
          { validator: validateTime, trigger: "blur" }
        ],
        content: [
          { validator: validateRequired, trigger: "blur" }
        ]
      },
      articleModal: false,
      delModal: false,
      modal_loading: false,
      willDelId: '',
      // 设置不可选日期
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      // 联系方式选项
      contactOptions: [
        {
          value: '手机号'
        },
        {
          value: '微信'
        },
        {
          value: '邮箱'
        }
      ]
    }
  },
  methods: {
    initUser() {
      const { objectId } = this.$store.getters.getUser
      this.userId = objectId
    },
    // 获取文章列表
    async getArticle() {
      const { articleType, pageNum, pageSize, userId } = this
      const temp = articleType === '招领启事' ? 'found' : 'lose'
      const data = { articleType: temp, pageNum, pageSize, userId }
      const that = this
      await getArticle(data).then(res => {
        if (res.data.err_code === 0) {
          that.total = res.data.data.total
          that.articleList = res.data.data.data
        }
      })
    },
    // 切换筛选类别
    changeRadio(val) {
      this.articleType = val
      this.pageNum = 1
      this.typeText = val === '招领启事' ? '拾获' : '遗失'
      this.getArticle()
    },
    // 切换页码
    changePageNum(val) {
      this.pageNum = val
      this.getArticle()
    },
    // 点击弹出框编辑
    editCard(id) {
      const data = { id }
      const that = this
      getArticleById(data).then(res => {
        if (res.data.err_code === 0) {
          that.articleData = res.data.data
          that.articleData.articleType = that.articleData.articleType === 'found' ? '招领启事' : '寻物启事'
          that.articleModal = true
          that.$nextTick(function() {
            that.$refs.myArticleEditor.getContent()
          })       
        }
      })
    },
    // 弹出删除对应文章框
    confirmDelCard(id) {
      this.delModal = true
      this.willDelId = id
    },
    // 删除文章
    async delCard() {
      const that = this
      that.modal_loading = true
      const data = {
        _id: this.willDelId
      }
      await deleteById(data).then(res => {
        if (res.data.err_code === 0) {
          that.modal_loading = false
          that.delModal = false
          this.$Message.success('删除成功！')
          that.getArticle()
        }
      })
    },
    // 获取格式化后的日期
    changeTimeQuantum(format) {
      this.articleData.timeQuantum = format
    },
    // 选择联系方式
    changeContact(value) {
      const { phone } = this.$store.getters.getUser
      if (value === '手机号') {
        this.articleData.contact[1] = phone
        return
      }
      this.articleData.contact[1] = ''
    },
    // 接收由子组件传过来的值，之后赋值到表单的content里
    updateContent(val) {
      this.articleData.content = val
    },
    // 校验表单
    validForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success("提交成功!")
          this.confirmEdit()
        } else {
          this.$Message.error("表单验证失败！")
        }
      })
    },
    async confirmEdit() {
      const { articleData } = this
      let temp = articleData
      temp.articleType = temp.articleType === '招领启事' ? 'found' : 'lose'
      await update(temp).then(res => {
        if (res.data.err_code === 0) {
          this.$Message.success('编辑成功！')
          this.articleModal = false
          this.getArticle()
        }
      })
    }
  },
  mounted(){
    this.initUser()
    this.getArticle()
  }
};
</script>

<style lang="less">
.myArticle{
  width: 100%;
}
.myArticle-top{
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
.myArticle-content{
  margin: .4rem 1.333333rem;
  font-family: kxzdt;
  span{
    font-size: .32rem;
  }
  .ivu-radio-group-button .ivu-radio-wrapper{
    line-height: .8rem;
    height: .8rem;
    font-size: .32rem;
  }
  .ivu-card-body{
    span{
      font-size: .266667rem;
      color: #ff9900;
    }
    img{
      width: .4rem;
      height: auto;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .ivu-card-bordered{
    cursor: pointer;
    margin: 0 .133333rem .133333rem;
  }
  .myArticle-pager{
    margin-top: .4rem;
    width: 100%;
  }
}
.myArticle-none{
  width: 100%;
  height: 6rem;
  span{
    font-size: 1.066667rem;
    font-family: kxzdt;
  }
}
.myArticle-form{
  font-family: kxzdt;
  label{
    font-size: .32rem !important;
  }
  .ivu-input{
    height: .853333rem;
    font-size: .266667rem;
  }
  .ivu-divider-inner-text{
    font-family: kxzdt;
    font-size: .32rem;
    color: #999;
  }
  .ivu-radio-group-button .ivu-radio-wrapper{
    line-height: .8rem;
    height: .8rem;
    font-size: .32rem;
  }
  .ivu-btn{
    height: .8rem;
    width: 2.4rem;
    font-size: .266667rem;
  }
  .personal-submit{
    height: 1rem;
    width: 2.4rem;
    margin: .3rem .4rem 0 0;
    font-size: .32rem;
  }
  .ivu-select-dropdown{    
    z-index: 9999;
  }
  .ivu-input-wrapper-large .ivu-input-icon{
    line-height: .8rem;
  }
  // 下拉选择框
  .ivu-select-large.ivu-select-single .ivu-select-selection{
    height: .88rem;
  }
  .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    height: .84rem;
    line-height: .8rem;
    font-size: .32rem;
  }
}
</style>
