import Vue from 'vue'
import VueRouter from 'vue-router'

import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
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
      children: [{
        path:':id',
        component:Disc
      }]
    },
    {
      path:"/singer",
      name:"Singer",
      component: Singer,
      children:[{
        path: ':id',
        component:SingerDetail
      }]
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
