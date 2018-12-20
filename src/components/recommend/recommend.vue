<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <!--轮播图组件-->
          <swiper :options="swiperOption" class="swiper-container">
            <swiper-slide v-for="(item,index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" class="img-size" @load="loadImage">
              </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'
  import {getRecommend, getDiscList} from '@/api/recommend'
  import {ERR_OK} from "@/api/config"
  import Scroll from "@/base/scroll/scroll"
  import Loading from "@/base/loading/loading"
  import {mapMutations} from 'vuex'


  export default {
    name: "recommend",
    components: {Loading, Scroll, swiper, swiperSlide},
    data(){
      return {
        checkloaded: true,
        recommends: [],
        discList: [],
        //设置轮播图组件参数
        swiperOption:{
          pagination:{el:".swiper-pagination"},
          loop:true, //循环播放
          //每张播放时长3秒，自动播放
          autoplay:true,
          speed:1000   //图片滑动速度
        }
      }
    },
    created(){
      this._getRecommend();
      this._getDiscList();
    },
    methods:{
      loadImage(){
        if (!this.checkloaded) {
          this.$refs.scroll.refresh();
          this.checkloaded = true;
        }
      },
      _getRecommend(){
        getRecommend().then((res)=>{
          if (res.code == ERR_OK){
            this.recommends = res.data.slider;
            console.log(this.recommends);
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
          if (res.code == ERR_OK){
            this.discList = res.data.list;
            console.log(this.discList);
          }
        })
      },
      selectItem(item){
        this.$router.push({
          path:`/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },
      ...mapMutations({
        setDisc:"SET_DISC"
      })
    },
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
        width 20px
        border-radius 5px
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .item
          display flex
          align-items center
          padding 0 20px 20px 20px
          .icon
            flex 0 0 60px
            width 60px
            padding-right 20px
          .text
            flex 1
            line-height 20px
            font-size $font-size-medium
            overflow hidden
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
    .loading-container
      display flex
      align-items center
</style>
