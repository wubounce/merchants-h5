import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: "*", redirect: '/login' },
  	{ path: '/login', name: 'login', component: () => import('@/page/login') },
  	{ path: '/reset', name: 'reset', component: () => import('@/page/reset/index') },
    { path: '/confimPwd', name: 'confimPwd', component: () => import('@/page/reset/confimPwd') },
    { path: '/index', name: 'index', component: () => import('@/page/index/index') },
    { path: '/report', name: 'report', component: () => import('@/page/report/index') },
    { path: '/management', name: 'management', component: () => import('@/page/management/index') },
    { path: '/reportdetail', name: 'reportdetail', component: () => import('@/page/report/detail') },

    // 设备管理
    { path: '/deviceMange', name: 'deviceMange', component: () => import('@/page/device/deviceMange/deviceMange') },
    {path: '/batchFuntionSet',name: 'batchFuntionSet',component: ()=>import('@/page/device/batchFuntionSet/batchFuntionSet')},
    { path: '/addDevice', name: 'addDevice', component: () => import('@/page/device/addDevice/addDevice') },
    { path: '/editDevice', name: 'editDevice', component: () => import('@/page/device/editDevice/editDevice') },
    { path: '/deviceDetail', name: 'deviceDetail', component: () => import('@/page/device/deviceDetail/deviceDetail') },


    { path: '/member', name: 'member', component: () => import('@/page/member/index') },
    { path: '/addMember', name: 'addMember', component: () => import('@/page/member/addMember') },
    { path: '/detailMember', name: 'detailMember', component: () => import('@/page/member/detailMember') },
    { path: '/order', name: 'order', component: () => import('@/page/order/index') },
    { path: '/orderdetail', name: 'orderdetail', component: () => import('@/page/order/orderdetail') },
    { path: '/shoplist', name: 'shopList', component: () => import('@/page/shop/shopList') },
    { path: '/addShop', name: 'addShop', component: () => import('@/page/shop/addShop') },
    { path: '/mapSearch', name: 'mapSearch', component: () => import('@/page/shop/mapSearch') },
    { path: '/shopDetail', name: 'shopDetail', component: () => import('@/page/shop/shopDetail') },
    { path: '/editShop', name: 'editShop', component: () => import('@/page/shop/editShop') },
    { path: '/todolist', name: 'todolist', component: () => import('@/page/todolist/index') },
    { path: '/marketing', name: 'marketing', component: () => import('@/page/marketing/index') },
    { path: '/addvip', name: 'addvip', component: () => import('@/page/marketing/addVIP') },
    { path: '/addMarket', name: 'addMarket', component: () => import('@/page/marketing/addMarket') },
    { path: '/vipDetail', name: 'vipDetail', component: () => import('@/page/marketing/vipDetail') },
    { path: '/editVip', name: 'editVip', component: () => import('@/page/marketing/editVip') },

    // 我的
    { path: '/user', name: 'user', component: () => import('@/page/user/user') },

    //钱包
    { path: '/wallet', name: 'wallet', component: () => import('@/page/wallet/wallet') },
    { path: '/accountList', name: 'accountList', component: () => import('@/page/wallet/accountList') },

  ]
});
