import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const Recommend = (resolve)=>{
  import('components/recommend/recommend').then((module)=>{
    resolve(module);
  })
}

const Singer = (resolve)=>{
  import('components/singer/singer').then((module)=>{
    resolve(module);
  })
}

const Rank = (resolve)=>{
  import('components/rank/rank').then((module)=>{
    resolve(module);
  })
}

const Search = (resolve)=>{
  import('components/search/search').then((module)=>{
    resolve(module);
  })
}

const SingerDetail = (resolve)=>{
  import('components/singer-detail/singer-detail').then((module)=>{
    resolve(module);
  })
}

const Disc = (resolve)=>{
  import('components/disc/disc').then((module)=>{
    resolve(module);
  })
}

const TopList = (resolve)=>{
  import('components/toplist/toplist').then((module)=>{
    resolve(module);
  })
}

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
      children:[{
        path: ':id',
        component:TopList
      }]
    },
    {
      path:"/search",
      name:"Search",
      component: Search
    }]
})

export default router
