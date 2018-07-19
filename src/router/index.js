import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: "*", redirect: '/login' },
  	{ path: '/login', name: 'login', component: () => import('@/page/login') },
  	{ path: '/reset', name: 'reset', component: () => import('@/page/reset/index') },
    { path: '/index', name: 'index', component: () => import('@/page/index/index') },
    { path: '/report', name: 'report', component: () => import('@/page/report/index') },
    { path: '/management', name: 'management', component: () => import('@/page/management/index') },
    { path: '/reportdetail', name: 'reportdetail', component: () => import('@/page/report/detail') }
  ]
});
