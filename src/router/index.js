import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
      path: "*",
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import ('@/page/login')
    },
    {
      path: '/reset',
      name: 'reset',
      component: () =>
        import ('@/page/reset/index')
    },
    {
      path: '/confimPwd',
      name: 'confimPwd',
      component: () =>
        import ('@/page/reset/confimPwd')
    },
    {
      path: '/index',
      name: 'index',
      component: () =>
        import ('@/page/index/index')
    },
    {
      path: '/report',
      name: 'report',
      component: () =>
        import ('@/page/report/index')
    },
    {
      path: '/management',
      name: 'management',
      component: () =>
        import ('@/page/management/index')
    },
    {
      path: '/reportdetail',
      name: 'reportdetail',
      component: () =>
        import ('@/page/report/detail')
    },

    // 设备管理
    {
      path: '/deviceMange',
      name: 'deviceMange',
      component: () =>
        import ('@/page/device/deviceMange/deviceMange')
    },
    {
      path: '/batchFuntionSet',
      name: 'batchFuntionSet',
      component: () =>
        import ('@/page/device/batchFuntionSet/batchFuntionSet')
    },
    {
      path: '/addDevice',
      name: 'addDevice',
      component: () =>
        import ('@/page/device/addDevice/addDevice')
    },
    {
      path: '/editDevice',
      name: 'editDevice',
      component: () =>
        import ('@/page/device/editDevice/editDevice')
    },
    {
      path: '/deviceDetail',
      name: 'deviceDetail',
      component: () =>
        import ('@/page/device/deviceDetail/deviceDetail')
    },
    {
      path: '/functionSet',
      name: 'functionSet',
      component: () =>
        import ('@/page/device/functionSet/functionSet')
    },

    {
      path: '/batchStart',
      name: 'batchStart',
      component: () =>
        import ('@/page/device/batchStart/batchStart'),
      children: [{
          path: '',
          component: () =>
            import ('@/page/device/batchStart/selectShop'),
          name: 'selectShop'
        },
        {
          path: '/selectFirstype',
          component: () =>
            import ('@/page/device/batchStart/selectFirstype'),
          name: 'selectFirstype'
        },
        {
          path: '/selectFunction',
          component: () =>
            import ('@/page/device/batchStart/selectFunction'),
          name: 'selectFunction'
        },
        {
          path: '/selectStartTime',
          component: () =>
            import ('@/page/device/batchStart/selectStartTime'),
          name: 'selectStartTime'
        }
      ]
    },

    {
      path: '/member',
      name: 'member',
      component: () =>
        import ('@/page/member/index')
    },
    {
      path: '/addMember',
      name: 'addMember',
      component: () =>
        import ('@/page/member/addMember')
    },
    {
      path: '/detailMember',
      name: 'detailMember',
      component: () =>
        import ('@/page/member/detailMember')
    },
    {
      path: '/editMember',
      name: 'editMember',
      component: () =>
        import ('@/page/member/editMember')
    },
    {
      path: '/order',
      name: 'order',
      component: () =>
        import ('@/page/order/index')
    },
    {
      path: '/orderdetail',
      name: 'orderdetail',
      component: () =>
        import ('@/page/order/orderdetail')
    },

    //店铺管理
    {
      path: '/shoplist',
      name: 'shopList',
      component: () =>
        import ('@/page/shop/shopList')
    },
    {
      path: '/addShop',
      name: 'addShop',
      component: () =>
        import ('@/page/shop/addShop')
    },
    {
      path: '/mapSearch',
      name: 'mapSearch',
      component: () =>
        import ('@/page/shop/mapSearch')
    },
    {
      path: '/shopDetail',
      name: 'shopDetail',
      component: () =>
        import ('@/page/shop/shopDetail')
    },
    {
      path: '/editShop',
      name: 'editShop',
      component: () =>
        import ('@/page/shop/editShop')
    },

    //待办事项
    {
      path: '/todolist',
      name: 'todolist',
      component: () =>
        import ('@/page/todolist/index')
    },
    {
      path: '/todoDetail',
      name: 'todoDetail',
      component: () =>
        import ('@/page/todolist/todoDetail')
    },
    {
      path: '/editTodolist',
      name: 'editTodolist',
      component: () =>
        import ('@/page/todolist/editTodolist')
    },

    //营销管理
    { path: '/marketing', name: 'marketing', component: () => import('@/page/marketing/index') },
    { path: '/addvip', name: 'addvip', component: () => import('@/page/marketing/addVIP') },
    { path: '/addMarket', name: 'addMarket', component: () => import('@/page/marketing/addMarket') },
    { path: '/detailMarket', name: 'detailMarket', component: () => import('@/page/marketing/detailMarket') },
    { path: '/editMarket', name: 'editMarket', component: () => import('@/page/marketing/editMarket') },
    { path: '/vipDetail', name: 'vipDetail', component: () => import('@/page/marketing/vipDetail') },
    { path: '/editVip', name: 'editVip', component: () => import('@/page/marketing/editVip') },

    // 我的
    {
      path: '/user',
      name: 'user',
      component: () =>
        import ('@/page/user/user')
    },

    
    
    {
      path: '/setting',
      name: 'setting',
      component: () =>
        import ('@/page/setting/index')
    },
    {
      path: '/personalSet',
      name: 'personalSet',
      component: () =>
        import ('@/page/setting/personalSet')
    },
    { path: '/changePwd', name: 'changePwd', component: () => import('@/page/setting/changePwd') },
    { path: '/contact', name: 'contact', component: () => import('@/page/contact/index') },
    { path: '/cooperation', name: 'cooperation', component: () => import('@/page/cooperation/index') },

    //钱包
    {
      path: '/wallet',
      name: 'wallet',
      component: () =>
        import ('@/page/wallet/wallet')
    },
    {
      path: '/accountList',
      name: 'accountList',
      component: () =>
        import ('@/page/wallet/accountList')
    },
    {
      path: '/accountDetail',
      name: 'accountDetail',
      component: () =>
        import ('@/page/wallet/accountDetail')
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () =>
        import ('@/page/wallet/withdraw')
    },
    {
      path: '/withdrawList',
      name: 'withdrawList',
      component: () =>
        import ('@/page/wallet/withdrawList')
    },
    {
      path: '/withdrawDetail',
      name: 'withdrawDetail',
      component: () =>
        import ('@/page/wallet/withdrawDetail')
    },
    {
      path: '/withdrawResult',
      name: 'withdrawResult',
      component: () =>
        import ('@/page/wallet/withdrawResult')
    },

  ]
});
