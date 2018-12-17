<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props:{
      songs:{
        type:Array,
        default:[]
      }
    },
    methods:{
      selectItem(item,index){
        this.$emit('select',item,index)
      },
      getDesc(song){
        return `${song.singer}·${song.album}`
      }
    }

  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .item
      height 64px
      font-size $font-size-medium
      .content
        line-height 20px
        overflow hidden
        .name
          no-wrap()
          color $color-text
        .desc
          no-wrap()
          margin-top 4px
          color $color-text-d
</style>
