<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="group in data" class="list-group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from "../scroll/scroll";
  export default {
    name: "listview",
    components: {Scroll},
    computed:{
      shortcutList(){
        return this.data.map((group)=>{
          return group.title.substring(0,1);
        })
      }
    },
    methods:{
      selectItem(item){
        this.$emit('select',item)
      }
    },
    props:{
      data:{
        type: Array,
        default: []
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    left 0
    top 0
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 100%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      z-index 10
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica
      .item
        padding 3px
        color $color-text-l
        font-size $font-size-small
</style>
