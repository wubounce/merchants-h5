import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import ('@/page/login'),
      meta: {title: '登录'}
    },
    {
      path: '/home',
      name: 'home',
      component: () =>import ('@/page/home'),
      meta: {title: '主页'},
      children:[
        {
          path: '/index',
          name: 'index',
          component: () => import ('@/page/index/index'),
          meta: {title: '首页'},
        },
        {
          path: '/report',
          name: 'report',
          component: () => import ('@/page/report/index'),
          meta: {title: '报表'},
        },
        {
          path: '/management',
          name: 'management',
          component: () => import ('@/page/management/index'),
          meta: {title: '管理'},
        },
        {
          path: '/user',
          name: 'user',
          component: () => import ('@/page/user/user'),
          meta: {title: '我的'},
        },
      ]
    },
    // 绑定手机号
    {
      path: '/bindPhone',
      name: 'bindPhone',
      component: () => import ('@/page/bindPhone'),
      meta: {title: '绑定手机号'},
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import ('@/page/reset/index'),
      meta: {title: '重置密码'},
    },
    {
      path: '/confimPwd',
      name: 'confimPwd',
      component: () => import ('@/page/reset/confimPwd'),
      meta: {title: '确认重置密码'},
    },
      
    {
      path: '/reportdetail',
      name: 'reportdetail',
      component: () => import ('@/page/report/detail'),
      meta: {title: '报表详情'},
    },

    // 设备管理
    {
      path: '/deviceMange',
      name: 'deviceMange',
      component: () => import ('@/page/device/deviceMange/deviceMange')
    },
    {
      path: '/deviceSearch',
      name: 'deviceSearch',
      component: () => import ('@/page/device/deviceMange/deviceSearch')
    },
    {
      path: '/batchFuntionSet',
      name: 'batchFuntionSet',
      component: () => import ('@/page/device/batchFuntionSet/batchFuntionSet')
    },
    {
      path: '/addDevice',
      name: 'addDevice',
      component: () => import ('@/page/device/addDevice/addDevice')

    },
    {
      path: '/editDevice',
      name: 'editDevice',
      component: () => import ('@/page/device/editDevice/editDevice')
    },
    {
      path: '/deviceDetail',
      name: 'deviceDetail',
      component: () => import ('@/page/device/deviceDetail/deviceDetail')
    },
    {
      path: '/functionSet',
      name: 'functionSet',
      component: () => import ('@/page/device/functionSet/functionSet')
    },

    {
      path: '/batchStart',
      name: 'batchStart',
      component: () => import ('@/page/device/batchStart/batchStart'),
      meta: {title: '批量启动'} //1-选择店铺
    },

    {
      path: '/selectFirstype',
      name: 'selectFirstype',
      component: () => import ('@/page/device/batchStart/selectFirstype'),
      meta: {title: '批量启动'} //2-选择设备
    },
    {
      path: '/selectFunction',
      name: 'selectFunction',
      component: () => import ('@/page/device/batchStart/selectFunction'),
      meta: {title: '批量启动'} //3-选择功能
    },

    {
      path: '/batchEdit',
      name: 'batchEdit',
      component: () => import ('@/page/device/batchEdit/batchEdit'),
      meta: {title: '批量编辑'} //1-选择店铺
    },

    {
      path: '/selectFirstypeEdit',
      name: 'selectFirstypeEdit',
      component: () => import ('@/page/device/batchEdit/selectFirstype'),
      meta: {title: '批量编辑'} //2-选择设备
    },
    {
      path: '/selectSecondtypeEdit',
      name: 'selectSecondtypeEdit',
      component: () => import ('@/page/device/batchEdit/selectSecondtype'),
      meta: {title: '批量编辑'} //3-选择功能
    },
    {
      path: '/selectFunctionEdit',
      name: 'selectFunctionEdit',
      component: () => import ('@/page/device/batchEdit/selectFunction'),
      meta: {title: '批量编辑'} //4-设置功能列表
    },

    {
      path: '/member',
      name: 'member',
      component: () => import ('@/page/member/index'),
      meta: {title: '人员管理'},
    },
    {
      path: '/addMember',
      name: 'addMember',
      component: () => import ('@/page/member/addMember'),
      meta: {title: '人员新增'},
    },
    {
      path: '/detailMember',
      name: 'detailMember',
      component: () => import ('@/page/member/detailMember'),
      meta: {title: '人员详情'},
    },
    {
      path: '/editMember',
      name: 'editMember',
      component: () => import ('@/page/member/editMember'),
      meta: {title: '人员修改'},
    },
    {
      path: '/order',
      name: 'order',
      component: () => import ('@/page/order/index'),
      meta: {title: '订单管理'},
    },
    {
      path: '/orderdetail',
      name: 'orderdetail',
      component: () => import ('@/page/order/orderDetail'),
      meta: {title: '订单详情'},
    },

    //店铺管理
    {
      path: '/shoplist',
      name: 'shopList',
      component: () => import ('@/page/shop/shopList'),
      meta: {title: '店铺管理'},
    },
    {
      path: '/addShop',
      name: 'addShop',
      component: () => import ('@/page/shop/addShop'),
      meta: {
        title: '店铺新增',
        keepAlive: true
      }
    },
    {
      path: '/mapSearch',
      name: 'mapSearch',
      component: () => import ('@/page/shop/mapSearch'),
      meta: {title: '地图搜索'},
    },
    {
      path: '/editMap',
      name: 'editMap',
      component: () => import ('@/page/shop/editMap'),
      meta: {
        title: '地图搜索',
        keepAlive: true
      },
    },
    {
      path: '/shopDetail',
      name: 'shopDetail',
      component: () => import ('@/page/shop/shopDetail'),
      meta: {title: '店铺详情'},
    },
    {
      path: '/editShop',
      name: 'editShop',
      component: () => import ('@/page/shop/editShop'),
      meta: {title: '店铺修改',keepAlive: true},
    },

    //待办事项
    {
      path: '/todolist',
      name: 'todolist',
      component: () => import ('@/page/todoList/index'),
      meta: {title: '待办事项'},
    },
    {
      path: '/todoDetail',
      name: 'todoDetail',
      component: () => import ('@/page/todoList/todoDetail'),
      meta: {title: '待办事项详情'},
    },
    {
      path: '/editTodolist',
      name: 'editTodolist',
      component: () => import ('@/page/todoList/editTodolist'),
      meta: {title: '修改事项'},
    },

    //营销管理
    { path: '/marketing', name: 'marketing', component: () => import('@/page/marketing/index'),meta: {title: '营销管理'} },
    { path: '/addvip', name: 'addvip', component: () => import('@/page/marketing/addVIP'),meta: {title: 'VIP卡新增'} },
    { path: '/addMarket', name: 'addMarket', component: () => import('@/page/marketing/addMarket'),meta: {title: '优惠新增'} },
    { path: '/detailMarket', name: 'detailMarket', component: () => import('@/page/marketing/detailMarket'),meta: {title: '优惠详情'} },
    { path: '/editMarket', name: 'editMarket', component: () => import('@/page/marketing/editMarket'),meta: {title: '优惠修改'} },
    { path: '/vipDetail', name: 'vipDetail', component: () => import('@/page/marketing/vipDetail'),meta: {title: 'VIP卡详情'} },
    { path: '/editVip', name: 'editVip', component: () => import('@/page/marketing/editVip'),meta: {title: 'VIP卡修改'} },
    
    //设置
    {
      path: '/setting',
      name: 'setting',
      component: () => import ('@/page/setting/index')
    },
    {
      path: '/personalSet',
      name: 'personalSet',
      component: () => import ('@/page/setting/personalSet')
    },
    {
      path: '/accountSet',
      name: 'accountSet',
      component: () => import ('@/page/setting/accountSet')
    },
    { path: '/changePwd', name: 'changePwd', component: () => import('@/page/setting/changePwd') },
    { path: '/setAlipay', name: 'setAlipay', component: () => import('@/page/setting/setAlipay') },
    { path: '/realName', name: 'realName', component: () => import('@/page/setting/realName') },
    { path: '/realNameGet', name: 'realNameGet', component: () => import('@/page/setting/realNameGet') },
    { path: '/contact', name: 'contact', component: () => import('@/page/contact/index') },
    { path: '/cooperation', name: 'cooperation', component: () => import('@/page/cooperation/index') },
    //sha1加密demo
    { path: '/getSignDemo', name: 'getSignDemo', component: () => import('@/page/setting/getSignDemo') },  

    //钱包
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import ('@/page/wallet/wallet'),
      meta: {title: '钱包'}
    },
    {
      path: '/accountList',
      name: 'accountList',
      component: () => import ('@/page/wallet/accountList'),
      meta: {title: '收支明细'}
    },
    {
      path: '/accountDetail',
      name: 'accountDetail',
      component: () => import ('@/page/wallet/accountDetail'),
      meta: {title: '收支详情'}
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () => import ('@/page/wallet/withdraw'),
      meta: {title: '余额 提现'}
    },
    {
      path: '/withdrawList',
      name: 'withdrawList',
      component: () => import ('@/page/wallet/withdrawList'),
      meta: {title: '提现明细'}
    },
    {
      path: '/withdrawResult',
      name: 'withdrawResult',
      component: () => import ('@/page/wallet/withdrawResult'),
      meta: {title: '提现结果'}
    },
    {
      path: "*",
      redirect: "/login"
    }
  ]
});
