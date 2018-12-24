<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSongList} from "@/api/recommend"
  import {getSongVkey} from "@/api/song";
  import {createSong} from "@/common/js/song"
  import {ERR_OK} from "@/api/config"
  import MusicList from "@/components/music-list/music-list"

  export default {
    name: "disc",
    components: {MusicList},
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title(){
        return this.disc.dissname;
      },
      bgImage(){
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {
      this._getSongList();
    },
    methods: {
      _getSongList(){
        if (!this.disc.dissid){
          this.$router.push('/recommend');
          return
        }
        getSongList(this.disc.dissid).then((res)=>{
          if (res.code == ERR_OK){
            console.log(res.cdlist[0].songlist);
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        })
      },
      _normalizeSongs(list){
        let ret = [];
        list.forEach((musicData)=>{
          getSongVkey(musicData.songmid).then((res)=>{
            // console.log("vkey="+res.data.items[0].vkey)
            const vkey = res.data.items[0].vkey;
            if (musicData.songid && musicData.albummid){
              ret.push(createSong(musicData,vkey));
            }
          })
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all .3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
