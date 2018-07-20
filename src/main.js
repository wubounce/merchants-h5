import Vue from 'vue';

import MintUI from 'mint-ui';
import './assets/iconfont/iconfont.css';
import 'normalize.css';
import 'mint-ui/lib/style.css';

import 'lib-flexible';

import App from './App';
import router from './router';
import store from './store';

import { getToken } from '@/utils/tool';

import VueAMap from 'vue-amap';
Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
// 高德的key
key: 'c6456d57a6cac4a772d3ef0f25cceccb',
// 插件集合
plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
// 高德 sdk 版本，默认为 1.4.4
v: '1.4.4'
});

Vue.use(MintUI);

Vue.config.productionTip = true;
Vue.config.devtools = true;

const whiteList = ['/login','/reset','/confimPwd']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (getToken()) {
      next();
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
