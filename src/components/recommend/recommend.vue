<template>
  <div class="recommend" ref="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
        <!--<slider>-->
          <!--<div v-for="item in recommends">-->
            <!--<a :href="item.linkUrl">-->
              <!--<img :src="item.picUrl">-->
            <!--</a>-->
          <!--</div>-->
        <!--</slider>-->
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
      </div>
    </div>
  </div>
</template>

<script>
  // import '@/common/css/swiper.css'
  import 'swiper/dist/css/swiper.css'
  import {swiper,swiperSlide} from 'vue-awesome-swiper'
  import {getRecommend} from '@/api/recommend'
  import {ERR_OK} from "@/api/config"


  export default {
    name: "recommend",
    components: {},
    data(){
      return {
        recommends: []
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
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
</style>
