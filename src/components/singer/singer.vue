<template>
  <div class="singer">
    <listview :data="singers" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from '@/api/singer'
  import {ERR_OK} from "@/api/config"
  import Singer from '@/common/js/singer'
  import Listview from "@/base/listview/listview";
  import {mapMutations} from 'vuex'
  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'
  export default {
    name: "singer",
    components: {Listview},
    data(){
      return{
        singers: []
      }
    },
    created(){
      this._getSingerList();

    },
    methods:{
      selectSinger(singer){
        this.$router.push({
          path:`/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList(){
        getSingerList().then((res)=>{
          if (res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list);
          }
        })
      },
      _normalizeSinger(list){
        let map = {
          hot:{
            title:HOT_NAME,
            items:[]
          }
        };
        list.forEach((item,index)=>{
          if (index < HOT_SINGER_LEN){
            map.hot.items.push(new Singer({
              name:item.Fsinger_name,
              id:item.Fsinger_mid
            }))
          }
          const key = item.Findex;
          if (!map[key]){
            map[key]={
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
            name:item.Fsinger_name,
            id:item.Fsinger_mid
          }))
        })
        //为了得到有序列表，我们需要处理 map
        let ret = [];
        let hot = [];
        for (let key in map){
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)){
            ret.push(val);
          } else if (val.title === HOT_NAME){
            hot.push(val)
          }
        }
        //charCodeAt()字母转化成ascii码
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger:'SET_SINGER' //把this.setSinger(setSinger) 映射为this.$store.commit(setSinger)
      })
    }
  }
</script>

<style scoped lang="stylus">
  .singer
    position fixed
    width 100%
    top 88px
    bottom 0
</style>
