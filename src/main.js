import 'babel-polyfill';
import 'url-search-params-polyfill';
import Vue from 'vue';

import MintUI from 'mint-ui';
import {Indicator, MessageBox } from 'mint-ui';
import { DatetimePicker } from 'vant';
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

import { Tree } from 'element-ui';
Vue.use(Tree);
Vue.use(filter);
Vue.use(VueAwesomeSwiper);
Vue.use(MintUI);
Vue.use(DatetimePicker);
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

const whiteList = ['/login','/reset','/confimPwd','/register','/referee','/userAgreement','/successTip']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  // 切换之前，把弹出框都关掉
  MessageBox.close();
  Indicator.close();
  if (getToken()) {
      next();
      if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            alert('您处于无痕浏览');
        }
      }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
  		next({ 
  			path: '/login', // 未登录则跳转至login页面 
  		}); 
    }
  }

});
router.afterEach(route => {
    // 从路由的元信息中获取 title 属性
    if (route.meta.title) {
        document.title = route.meta.title;
        // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
        if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            const hackIframe = document.createElement('iframe');
            hackIframe.style.display = 'none';
            hackIframe.src = '/static/html/fixiosTitle.html?r=' + Math.random();
            document.body.appendChild(hackIframe);
            setTimeout(_ => {
                document.body.removeChild(hackIframe);
            }, 300);
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
