import 'babel-polyfill';
import 'lib-flexible';
import './assets/iconfont/iconfont.css';
import './assets/iconfont/indexfont.css';
import App from './App';
import router from './router';
import store from './store';

import { Indicator, MessageBox } from 'mint-ui';
import { getToken } from '@/utils/tool';
import filter from '@/utils/filter';

Vue.use(filter);

Vue.config.productionTip = true;
Vue.config.devtools = true;

const whiteList = ['/login', '/reset', '/confimPwd', '/register', '/referee', '/userAgreement', '/successTip', '/contact', '/cooperation', '/helpcenter', '/helpdetail', '/downloadapp']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  // 切换之前，把弹出框都关掉
  MessageBox.close();
  Indicator.close();
  if (getToken()) {
    if (!store.state.user.userInfo) {
      store.dispatch('getUserInfo').then(() => {});
    }
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
        path: '/login' // 未登录则跳转至login页面
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
//系统错误捕获
const errorHandler = (error, vm) => {
  var logger = new window.Tracker('cn-shanghai.log.aliyuncs.com', 'qiekj-web-log', 'merchant-h5');
  logger.push('appName', '商家端');
  logger.push('error', error);
  logger.logger();
  return true;
};
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = function(error) {
  return errorHandler(error, this);
};

// window error捕获的错误
window.onerror = (msg, url, line, col, error) => {
  var logger = new window.Tracker('cn-shanghai.log.aliyuncs.com', 'qiekj-web-log', 'merchant-h5');
  logger.push('appName', '商家端');
  logger.push('msg', msg);
  logger.push('url', url);
  logger.push('line', line);
  logger.push('col', col);
  logger.push('error', error);
  logger.logger();
  return true;
};

// promise rejecttion 错误捕获，promise错误需要单独捕获
window.addEventListener('unhandledrejection', e => {
  var logger = new window.Tracker('cn-shanghai.log.aliyuncs.com', 'qiekj-web-log', 'merchant-h5');
  logger.push('appName', '商家端');
  logger.push('info', e.reason);
  logger.push('url', e.reason.config.url);
  logger.push('data', e.reason.config.data);
  logger.push('OS', e.path[0].AP.ua);
  logger.logger();
  return true;
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
