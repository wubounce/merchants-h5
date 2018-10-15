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
          meta: {title: '企鹅商家管理平台'},
        },
        {
          path: '/report',
          name: 'report',
          component: () => import ('@/page/report/index'),
          meta: {title: '报表',keepAlive:false},
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
        }

      ]
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import ('@/page/activity'),
      meta: {title: '运营活动'},
    },
    //首页头部收益相关
    {
      path: '/index/totalincome',
      name: 'totalincome',
      component: () => import ('@/page/index/totalincome'),
      meta: {title: '总收益'},
    },
    {
      path: '/index/monthincome',
      name: 'monthincome',
      component: () => import ('@/page/index/monthincome'),
      meta: {title: '当月收益'},
    },
    {
      path: '/index/todayincome',
      name: 'todayincome',
      component: () => import ('@/page/index/todayincome'),
      meta: {title: '今日收益'},
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
      path: '/register',
      name: 'register',
      component: () => import ('@/page/register/index'),
      meta: {title: '注册账号'},
    },
    {
      path: '/referee',
      name: 'referee',
      component: () => import ('@/page/register/referee'),
      meta: {title: '注册'},
    },
    {
      path: '/userAgreement',
      name: 'userAgreement',
      component: () => import ('@/page/register/userAgreement'),
      meta: {title: '用户注册协议'},
    },
    {
      path: '/successTip',
      name: 'successTip',
      component: () => import ('@/page/register/successTip'),
      meta: {title: '注册'},
    },
    {
      path: '/confimPwd',
      name: 'confimPwd',
      component: () => import ('@/page/reset/confimPwd'),
      meta: {title: '确认重置密码'},
    },
    {
      path: '/reportShopDetail',
      name: 'reportShopDetail',
      component: () => import ('@/page/report/shopDetail'),
      meta: {title: '报表详情'},
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
      component: () => import ('@/page/device/deviceMange/deviceMange'),
      meta: {title: '设备管理'},
    },
    {
      path: '/deviceMonthFlow',
      name: 'deviceMonthFlow',
      component: () => import ('@/page/device/deviceMange/deviceMonthFlow'),
      meta: {title: '设备明细'},
    },
    {
      path: '/deviceDayFlow',
      name: 'deviceDayFlow',
      component: () => import ('@/page/device/deviceMange/deviceDayFlow'),
      meta: {title: '设备明细'},
    },
    {
      path: '/deviceOrderFlow',
      name: 'deviceOrderFlow',
      component: () => import ('@/page/device/deviceMange/deviceOrderFlow'),
      meta: {title: '设备明细'},
    },
    {
      path: '/deviceSearch',
      name: 'deviceSearch',
      component: () => import ('@/page/device/deviceMange/deviceSearch'),
      meta: {title: '设备搜索'},
    },
    {
      path: '/batchFuntionSet',
      name: 'batchFuntionSet',
      component: () => import ('@/page/device/batchFuntionSet/batchFuntionSet'),
      meta: {title: '批量设置'},
    },
    {
      path: '/addDevice',
      name: 'addDevice',
      component: () => import ('@/page/device/addDevice/addDevice'),
      meta: {title: '新增设备'},
    },
    {
      path: '/editDevice',
      name: 'editDevice',
      component: () => import ('@/page/device/editDevice/editDevice'),
      meta: {title: '编辑设备'},
    },
    {
      path: '/deviceDetail',
      name: 'deviceDetail',
      component: () => import ('@/page/device/deviceDetail/deviceDetail'),
      meta: {title: '设备详情'},
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
      meta: {title: '人员新增', keepAlive:true},
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
      meta: {title: '人员编辑', keepAlive:true},
    },
    {
      path: '/premList',
      name: 'premList',
      component: () => import ('@/page/member/premList'),
      meta: {title: '人员权限'},
    },
    {
      path: '/memeberSearch',
      name: 'memeberSearch',
      component: () => import ('@/page/member/memeberSearch'),
      meta: {title: '人员搜索'},
    },
    {
      path: '/order',
      name: 'order',
      component: () => import ('@/page/order/index'),
      meta: {title: '订单查看'},
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
        keepAlive:true
      },
      // children: [
      //   {
      //     path: 'test',
      //     name: 'test',
      //     component: () => import ('@/page/shop/test/test'),
      //     //meta: {title: '新增店铺'},
      //   }
      // ]
    },
    {
      path: '/mapSearch',
      name: 'mapSearch',
      component: () => import ('@/page/shop/mapSearch'),
      meta: {title: '新增店铺'},
    },
    {
      path: '/editMap',
      name: 'editMap',
      component: () => import ('@/page/shop/editMap'),
      meta: {
        title: '编辑店铺'
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
      meta: {title: '店铺修改',keepAlive:true},
    },
    {
      path: '/shopMonthFlow',
      name: 'shopMonthFlow',
      component: () => import ('@/page/shop/shopMonthFlow'),
      meta: {title: '店铺明细'},
    },
    {
      path: '/shopDayFlow',
      name: 'shopDayFlow',
      component: () => import ('@/page/shop/shopDayFlow'),
      meta: {title: '店铺明细'},
    },
    {
      path: '/shopOrderFlow',
      name: 'shopOrderFlow',
      component: () => import ('@/page/shop/shopOrderFlow'),
      meta: {title: '店铺明细'},
    },
    {
      path: '/shopSearch',
      name: 'shopSearch',
      component: () => import ('@/page/shop/shopSearch'),
      meta: {title: '店铺搜索'},
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
      meta: {title: '修改待办事项 '},
    },

    //营销管理
    { path: '/marketing', name: 'marketing', component: () => import('@/page/marketing/index'),meta: {title: '营销管理'} },
    { path: '/addvip', name: 'addvip', component: () => import('@/page/marketing/addVIP'),meta: {title: 'VIP卡新增'} },
    { path: '/addMarket', name: 'addMarket', component: () => import('@/page/marketing/addMarket'),meta: {title: '新增限时优惠'} },
    { path: '/detailMarket', name: 'detailMarket', component: () => import('@/page/marketing/detailMarket'),meta: {title: '限时优惠详情'} },
    { path: '/editMarket', name: 'editMarket', component: () => import('@/page/marketing/editMarket'),meta: {title: '修改限时优惠'} },
    { path: '/vipDetail', name: 'vipDetail', component: () => import('@/page/marketing/vipDetail'),meta: {title: 'VIP卡详情'} },
    { path: '/editVip', name: 'editVip', component: () => import('@/page/marketing/editVip'),meta: {title: 'VIP卡修改'} },
    
    //设置
    {
      path: '/setting',
      name: 'setting',
      component: () => import ('@/page/setting/index'),
      meta: {title: '设置'},
    },
    {
      path: '/personalSet',
      name: 'personalSet',
      component: () => import ('@/page/setting/personalSet'),
      meta: {title: '个人信息'},
    },
    {
      path: '/accountSet',
      name: 'accountSet',
      component: () => import ('@/page/setting/accountSet'),
      meta: {title: '账户设置'},
    },
    { path: '/changePwd', name: 'changePwd', component: () => import('@/page/setting/changePwd'),meta: {title: '修改密码'}, },
    { path: '/setAlipay', name: 'setAlipay', component: () => import('@/page/setting/setAlipay'),meta: {title: '绑定支付宝账户'}, },
    { path: '/realName', name: 'realName', component: () => import('@/page/setting/realName'),meta: {title: '实名认证'}, },
    { path: '/realNameGet', name: 'realNameGet', component: () => import('@/page/setting/realNameGet'),meta: {title: '实名认证详情'}, },
    { path: '/contact', name: 'contact', component: () => import('@/page/contact/index'),meta: {title: '联系客服'}, },
    { path: '/cooperation', name: 'cooperation', component: () => import('@/page/cooperation/index'),meta: {title: '合作热线'}, },
    {
      path: '/success',
      name: 'success',
      component: () => import ('@/page/setting/success'),
      meta: {title: '实名认证'},
    },
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
      meta: {title: '余额提现'}
    },
    {
      path: '/withdrawList',
      name: 'withdrawList',
      component: () => import ('@/page/wallet/withdrawList'),
      meta: {title: '提现记录'}
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
