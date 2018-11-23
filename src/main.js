import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from '@/router/router'
import fastclick from 'fastclick'
import store from './store'
// import vueAwesomeSwiper from 'vue-awesome-swiper'
// import "swiper/dist/css/swiper.css"
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
fastclick.attach(document.body);
// Vue.use(vueAwesomeSwiper);
Vue.config.productionTip = false;
Vue.use(VueLazyLoad,{
  loading: require('common/image/loading.png')
})
new Vue({
  el: '#app',
  router,
  store,
  render:h => h(App)
});
