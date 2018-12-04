<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" :data="songs" ref="list" class="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll"
  import SongList from "@/base/song-list/song-list"

  const RESERVED_HEIGHT = 40
  export default {
    name: "music-list",
    components: {SongList, Scroll},
    props:{
      songs:{
        type: Array,
        default: []
      },
      bgImage:{
        type: String,
        default: ""
      },
      title:{
        type: String,
        default: ""
      }
    },
    data(){
      return {
        scrollY: 0
      }
    },
    computed:{
      bgStyle(){
        return `background-image:url(${this.bgImage})`
      }
    },
    created(){
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    },
    methods:{
      scroll(pos){
        this.scrollY = pos.y;
        // console.log(this.scrollY)
      },
      back(){
        this.$router.back();
      }
    },
    watch:{
      scrollY(newVal) {
        let zIndex = 0;
        let translateY = Math.max(this.minTranslateY,newVal);
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;
        if (newVal < this.minTranslateY){
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        } else {
          this.$refs.bgImage.style.paddingTop = "70%";
          this.$refs.bgImage.style.height = 0;
        }
        this.$refs.bgImage.style.zIndex = zIndex;
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .music-list
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
    .bg-layer
      position relative
      height 100%
      background $color-background
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background $color-background
      .song-list-wrapper
        padding 20px 30px

</style>
