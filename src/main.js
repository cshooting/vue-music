import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from '@/router/router'
import fastclick from 'fastclick'
// import vueAwesomeSwiper from 'vue-awesome-swiper'
// import "swiper/dist/css/swiper.css"
import 'common/stylus/index.styl'

fastclick.attach(document.body);
// Vue.use(vueAwesomeSwiper);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  render:h => h(App)
});
