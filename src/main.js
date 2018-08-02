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
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
Vue.use(VueAwesomeSwiper);
import { Tree } from 'element-ui';
Vue.use(Tree);
Vue.use(MintUI);
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
//v-title
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value;
  }
});

/**权限指令**/
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
       // el.parentNode.removeChild(el);
      var childs = el.childNodes;
      if (childs) {
        for(var i = childs.length - 1; i >= 0; i--) { 
          el.removeChild(childs[i]); 
        }
      }
      el.style.display = "none";
    }
  }
});
import { getMenu } from '@/utils/tool';
//权限检查方法
Vue.prototype.$_has = function(value) {
  let isExist=false;
  let buttonpermsStr = getMenu();
  if(buttonpermsStr==undefined || buttonpermsStr==null){
    return false;
  }
  for(let i=0;i<buttonpermsStr.length;i++){
    if(buttonpermsStr[i].perms.includes(String(value))){
      isExist=true;
      break;
    }
  }
  return isExist;
};

//签名算法：
Vue.prototype.get_sign = (obj)=>{

  obj._appid = '44efec05494c4ca3a4a7ada47722a1a8';

  let newKey = Object.keys(obj).sort();

  let newObj = {};
  for(let i = 0; i < newKey.length; i++) {
    newObj[newKey[i]] = obj[newKey[i]]; 
  }
  
  let jsonstr = JSON.stringify(newObj);
  let str2 = jsonstr.replace(new RegExp(':','g'),'=').replace(new RegExp(',','g'),'&');
  let str3 = str2.substring(1,str2.length-1);
  console.log('加密前的str:',str3.split('"').join(''));
  
  //sha1加密
  let sha1 = require('sha1');
  let _sign = sha1(str3.split('"').join(''));
  console.log("sha1加密后的str:",_sign);
  delete obj._appid;
  obj._sign = _sign;
  console.log('处理过的请求参数：',obj);
  return obj;
};