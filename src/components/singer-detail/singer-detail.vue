<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from "@/api/singer"
  import {createSong} from "@/common/js/song"
  import {ERR_OK} from "@/api/config"
  import MusicList from "@/components/music-list/music-list"

  export default {
    name: "singer-detail",
    components: {MusicList},
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title(){
        return this.singer.name;
      },
      bgImage(){
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getSingerDetail();
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSong(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;  //解构赋值
          // let musicData = item.musicData;
          // console.log(item)
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background

  .slide-enter-active, .slide-leave-active
    transition all .3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
