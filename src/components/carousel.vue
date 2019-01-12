<template>
<div class="carousel">
  <Carousel autoplay v-model="current" loop radius-dot trigger="hover">
    <CarouselItem v-for="(item, index) in carouselImgs" :key="index">
      <div class="demo-carousel"><img mode="widthFix" :src="item" alt=""></div>
    </CarouselItem>
  </Carousel>
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
.carousel {
  width: 100%;
}
.demo-carousel{
  width: 100%;
  img{
    width: 100%;
  }
}
</style>
