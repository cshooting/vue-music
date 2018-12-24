<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="topList" ref="topList">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songList">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getTopList} from "@/api/rank"
  import {ERR_OK} from "@/api/config"
  import Scroll from "@/base/scroll/scroll"
  import Loading from "@/base/loading/loading"
  import {mapMutations} from 'vuex'

  export default {
    name: "rank",
    components: {Loading, Scroll},
    data(){
      return {
        topList:[]
      }
    },
    created(){
      this._getTopList();
    },
    methods:{
      selectItem(item){
        this.$router.push({
          path:`/rank/${item.id}`
        });
        this.setTopList(item);
      },
      _getTopList(){
        getTopList().then((res)=>{
          if (res.code === ERR_OK){
            this.topList = res.data.topList;
            console.log(this.topList)
          }

        })
      },
      ...mapMutations({
        setTopList:"SET_TOP_LIST"
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position fixed
    width 100%
    top:88px
    bottom 0
    .topList
      height 100%
      overflow hidden
      .item
        display flex
        height 110px
        .icon
          flex 0 0 100
          width 100px
          height 100px
        .songList
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          background $color-highlight-background
          color $color-text-d
          font-size $font-size-small
          .song
            no-wrap()
            line-height 26px
      .loading-container
        display flex
        align-items center
</style>
