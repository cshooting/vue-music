<template>
  <div class="player" v-show="playList.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <div class="time time-r">{{formatTime(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" :class="miniPlayIcon" class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from "@/common/js/dom"
  import ProgressBar from "@/base/progress-bar/progress-bar"
  import {playMode} from "@/common/js/config";
  import {shuffle} from "@/common/js/util";
  import ProgressCircle from "../../base/progress-circle/progress-circle";

  const transform = prefixStyle('transform')

  export default {
    name: "player",
    components: {ProgressCircle, ProgressBar},
    data(){
      return {
        songReady:false,
        currentTime:0,
        radius: 32
      }
    },
    computed: {
      iconMode(){
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop':'icon-random'
      },
      percent(){
        return this.currentTime / this.currentSong.duration;
      },
      cdCls(){
        return this.playing ? 'play' : 'play pause'
      },
      playIcon(){
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniPlayIcon(){
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        };
        animations.registerAnimation({
          name: "move",
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const targetWidth = 40  //动画移动目标的宽度
        const paddingLeft = 40  //移动目标中心点距离左边的距离
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8  //动画要移动对象的宽度
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      togglePlaying(){
        this.setPlayingState(!this.playing);

      },
      end(){
        if (this.mode === playMode.loop){
          this.loop();
        }else {
          this.next();
        }
      },
      loop(){
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      },
      prev(){
        if (!this.songReady){
          return
        }
        let index = this.currentIndex-1;
        if (index === -1){
          index = this.playList.length-1;
        }
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlaying();
        }
        this.songReady = false;
      },
      next(){
        if (!this.songReady){
          return
        }
        let index = this.currentIndex+1;
        if(index === this.playList.length){
          index = 0
        }
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlaying();
        }
        this.songReady = false;
      },
      ready(){
        this.songReady = true;
      },
      error(){
        this.songReady = true;
      },
      updateTime(e){
        this.currentTime = e.target.currentTime;
      },
      formatTime(time){
        let minutes = this._pad(Math.floor(time/60));
        let seconds = this._pad(Math.floor(time%60));
        return `${minutes}:${seconds}`
      },
      _pad(num,n=2){
        let len = num.toString().length
        while (len < n){
          num = '0' + num;
          len++;
        }
        return num;
      },
      changeMode(){
        const mode = (this.mode+1)%3;
        this.setPlayMode(mode);
        let list = null;
        if (mode === playMode.random){
          list = shuffle(this.sequenceList);
        }else {
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.setPlayList(list);
      },
      resetCurrentIndex(list){
        let index = list.findIndex((item)=>{
          return item.id === this.currentSong.id;
        })
        this.setCurrentIndex(index);
      },
      onProgressBarChange(percent){
        this.$refs.audio.currentTime = this.currentSong.duration*percent;
        if(!this.playing){
          this.togglePlaying();
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong(newSong,oldSong){
        if (newSong.id === oldSong.id){
          return
        }
        this.$nextTick(()=>{
          this.$refs.audio.play()
        })
      },
      playing(newPlaying){
        const audio = this.$refs.audio;
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause();
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 150
      background $color-background
      .background
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        z-index -1
        opacity 0.6
        filter blur(20px)
      .top
        position relative
        margin-bottom 25px
        .back
          position absolute
          top 0
          left 6px
          z-index 50
          .icon-back
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          line-height 40px
          text-align center
          no-wrap()
          font-size $font-size-large
          color $color-text
        .subtitle
          line-height 20px
          text-align center
          font-size $font-size-medium
          color $color-text
      .middle
        position fixed
        width 100%
        top 80px
        bottom 170px
        white-space nowrap
        font-size 0
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            left 10%
            top 0
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255,255,255,0.1)
              border-radius 50%
              &.play
                animation-play-state running
                animation rotate 20s linear infinite  //动画名|时间|渐变类型|循环
              &.pause
                animation-play-state paused
              .image
                position absolute
                width 100%
                height 100%
                border-radius 50%
      .bottom
        position absolute
        bottom 50px
        width 100%
        .operators
          display flex
          align-items center
          .icon
            flex 1
            color $color-theme
            i
              font-size 30px
          .i-left
            text-align right
          .i-center
            padding 0 20px
            text-align center
            i
              font-size 40px
          .i-right
            text-align left
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0 auto
          padding 10px 0
          .time
            color $color-text
            font-size $font-size-small
            flex 0 0 40px
            line-height 30px
            width 40px
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
      &.normal-enter-active,&.normal-leave-active
        transition all 0.3s
        .top,.bottom
          transition all 0.3s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter,&.normal-leave-to
        opacity 0
        .top
          transform translate3d(0,-100px,0)
        .bottom
          transform translate3d(0,100px,0)
    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 180
      width 100%
      height 60px
      background $color-highlight-background
      &.mini-enter-active,&.mini-leave-active
        transition all 0.3s
      &.mini-enter,&.mini-leave-to
        opacity 0
      .icon
        flex 0 0 40px
        width 40px
        padding 0 10px 0 20px
        img
          border-radius 50%
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height 20px
        overflow hidden
        .name
          margin-bottom 2px
          no-wrap()
          font-size $font-size-medium
          color $color-text
        .desc
          no-wrap()
          font-size $font-size-small
          color $color-text-d
      .control
        flex 0 0 30
        width 30px
        padding 0 10px
        font-size 30px
        color $color-theme-d
        .miniIcon
          position absolute
          left 0
          top 0
  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>
