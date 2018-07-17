import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: "*", redirect: '/login' },
  	{ path: '/login', name: 'login', component: () => import('@/page/login') },
    { path: '/index', name: 'index', component: () => import('@/page/index/index') },
    { path: '/report', name: 'report', component: () => import('@/page/report/report') }
  ]
});
