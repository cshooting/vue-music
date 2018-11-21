import Vue from 'vue'
import VueRouter from 'vue-router'

import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'

Vue.use(VueRouter)
const router = new VueRouter({
  linkActiveClass:"active",
  mode:"history",
  routes:[
    {
      path:"/",
      redirect:"/recommend"
    },
    {
      path:"/recommend",
      name:"Recommend",
      component: Recommend,
    },
    {
      path:"/singer",
      name:"Singer",
      component: Singer,
    },
    {
      path:"/rank",
      name:"Rank",
      component: Rank,
    },
    {
      path:"/search",
      name:"Search",
      component: Search
    }]
})

export default router
