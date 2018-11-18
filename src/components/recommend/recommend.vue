<template>
  <div class="recommend" ref="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
        <!--轮播图组件-->
        <swiper :options="swiperOption" class="swiper-container">
          <swiper-slide v-for="(item,index) in recommends" :key="index">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" class="img-size">
            </a>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'
  import {getRecommend} from '@/api/recommend'
  import {ERR_OK} from "@/api/config"


  export default {
    name: "recommend",
    components: {swiper, swiperSlide},
    data(){
      return {
        recommends: [],
        //设置轮播图组件参数
        swiperOption:{
          pagination:{el:".swiper-pagination"},
          loop:true, //循环播放
          //每张播放时长3秒，自动播放
          autoplay:2000,
          speed:1000   //图片滑动速度
        }
      }
    },
    created(){
      this._getRecommend();
    },
    methods:{
      _getRecommend(){
        getRecommend().then((res)=>{
          if (res.code == ERR_OK){
            this.recommends = res.data.slider;
            console.log(this.recommends);
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        height 200px
        overflow hidden
        .swiper-container
          margin 10px
          .img-size
            width 100%
            height 200px
          .swiper-pagination
            &.swiper-pagination-bullets
              bottom 30px
              left 0
              width 100%
      /*>>>样式穿透，修改第三方组件的样式*/
      .slider-wrapper >>> .swiper-pagination-bullet-active
        width 14px
        height 8px
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
</style>
