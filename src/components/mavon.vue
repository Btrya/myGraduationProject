<template>
  <div class="mavon-editor">
    <mavon-editor v-model="value" :toolbars="toolbars"/>
  </div>
</template>

<script>
export default {
  props: {
    // 接收父组件的值，不直接绑定这个值是为了避免子组件直接修改这个值出现问题
    content: String
  },
  data() {
    return {
      value: "",
      // 设置
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: false, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: false, // 链接
        imagelink: false, // 图片链接
        code: false, // code
        table: false, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: false, // 单双栏模式
        preview: true // 预览
      }
    };
  },
  methods: {
    // 给子组件赋值
    clearValue() {
      this.value = ''
    },
    getContent() {
      this.value = this.content
    }
  },
  mounted() {
    // 挂载给子组件赋值
    this.getContent()
  },
  watch: {
    // 监听value的变化，并且将变化后的值传给父组件
    value(val) {
      this.$emit("updateContent", val);
    }
  }
};
</script>

<style scoped lang="less">
</style>
