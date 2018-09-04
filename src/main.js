import Vue from 'vue';

import MintUI from 'mint-ui';
import { MessageBox } from 'mint-ui';
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import './assets/iconfont/iconfont.css';
import './assets/iconfont/indexfont.css';
import 'normalize.css';
import 'mint-ui/lib/style.css';

import 'lib-flexible';

import App from './App';
import router from './router';
import store from './store';

import { getToken } from '@/utils/tool';
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import filter from '@/utils/filter';

Vue.use(filter);
Vue.use(VueAwesomeSwiper);
Vue.use(MintUI);
Vue.use(Vant);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
// 高德的key
key: 'c6456d57a6cac4a772d3ef0f25cceccb',
// 插件集合
plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
// 高德 sdk 版本，默认为 1.4.4
v: '1.4.4'
});

Vue.config.productionTip = true;
Vue.config.devtools = true;

const whiteList = ['/login','/reset','/confimPwd','/register']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  // 切换之前，把弹出框都关掉
  MessageBox.close();
  if (getToken()) {
      next();
      // 已初始化权限数据，不处理
      if (store.state.user.menu.length<=0) {
        store.dispatch('getMenu');
      }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
  		next({ 
  			path: '/login', // 未登录则跳转至login页面 
  			query: {redirect: to.fullPath} // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面 
  		}); 
    }
  }

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
