import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const routes = [
  {
    path: '/',
    name: 'Login',
    component: resolve => require(['@/views/Login/Login'], resolve),
    meta: {auth: true, title: '用户登录'}
  },
  // {
  //   path: '/basic-manage/role-manage',
  //   name: 'RoleManage',
  //   component: resolve => require(['@/views/BasicManage/RoleManage/RoleManage'], resolve),
  //   meta: {auth: true, title: '角色管理'}
  // },

  // 运单管理
  {
    path: '/waybill-manage/new-waybill',
    name: 'NewWaybill',
    component: () => import('@/views/WaybillManage/NewWaybill/NewWaybill'),
    meta: {auth: true, title: '新建运单'}
  },
  {
    path: '/waybill-manage/all-waybill',
    name: 'AllWaybill',
    component: () => import('@/views/WaybillManage/AllWaybill/AllWaybill'),
    meta: {auth: true, title: '全部运单'}
  },
  {
    path: '/waybill-manage/waybill-detail',
    name: 'WaybillDetail',
    component: () => import('@/views/WaybillManage/WaybillDetail/WaybillDetail'),
    meta: {auth: true, title: '运单详情'}
  },
  {
    path: '/waybill-manage/stay-send-Waybill',
    name: 'StaySendWaybill',
    component: () => import('@/views/WaybillManage/StaySendWaybill/StaySendWaybill'),
    meta: {auth: true, title: '待发货运单'}
  },
  {
    path: '/waybill-manage/transport-waybill',
    name: 'TransportWaybill',
    component: () => import('@/views/WaybillManage/TransportWaybill/TransportWaybill'),
    meta: {auth: true, title: '运输中运单'}
  },
  {
    path: '/waybill-manage/have-signed-waybill',
    name: 'HaveSignedWaybill',
    component: () => import('@/views/WaybillManage/HaveSignedWaybill/HaveSignedWaybill'),
    meta: {auth: true, title: '已签收运单'}
  },
  {
    path: '/waybill-manage/have-close-waybill',
    name: 'HaveCloseWaybill',
    component: () => import('@/views/WaybillManage/HaveCloseWaybill/HaveCloseWaybill'),
    meta: {auth: true, title: '已关闭运单'}
  },
  {
    path: '/waybill-manage/stay-make-cargo-waybill',
    name: 'StayMakeCargoWaybill',
    component: () => import('@/views/WaybillManage/StayMakeCargoWaybill/StayMakeCargoWaybill'),
    meta: {auth: true, title: '待接货运单'}
  },

  // 调度管理
  {
    path: '/dispatch-manage/shift-plan-manage',
    name: 'ShiftPlanManage',
    component: () => import('@/views/DispatchManage/ShiftPlanManage/ShiftPlanManage'),
    meta: {auth: true, title: '班次计划管理'}
  },
  {
    path: '/dispatch-manage/order-blank-manage',
    name: 'OrderBlankManage',
    component: () => import('@/views/DispatchManage/OrderBlankManage/OrderBlankManage'),
    meta: {auth: true, title: '配货单管理'}
  },
  {
    path: '/dispatch-manage/order-blank-detail',
    name: 'OrderBlankDetail',
    component: () => import('@/views/DispatchManage/OrderBlankManage/OrderBlankDetail'),
    meta: {auth: true, title: '配货单详情'}
  },
  {
    path: '/dispatch-manage/stay-dispatch-bill',
    name: 'StayDispatchBill',
    component: () => import('@/views/DispatchManage/StayDispatchBill/StayDispatchBill'),
    meta: {auth: true, title: '待调度运单'}
  },

  // 财务管理
  {
    path: '/finance-manage/fic-all-wbill',
    name: 'FicAllWbill',
    component: () => import('@/views/FinanceManage/FicAllWbill/FicAllWbill'),
    meta: {auth: true, title: '全部运单'}
  },
  {
    path: '/finance-manage/fic-wbill-detail',
    name: 'FicWbillDetail',
    component: () => import('@/views/FinanceManage/FicWbillDetail/FicWbillDetail'),
    meta: {auth: true, title: '财务运单详情'}
  },
  {
    path: '/finance-manage/fic-finish-wbill',
    name: 'FicFinishWbill',
    component: () => import('@/views/FinanceManage/FicFinishWbill/FicFinishWbill'),
    meta: {auth: true, title: '已完结运单'}
  },
  {
    path: '/finance-manage/stay-receipt',
    name: 'StayReceipt',
    component: () => import('@/views/FinanceManage/StayReceipt/StayReceipt'),
    meta: {auth: true, title: '待收款'}
  },
  {
    path: '/finance-manage/receipt-tab',
    name: 'ReceiptTab',
    component: () => import('@/views/FinanceManage/StayReceipt/ReceiptTab'),
    meta: {auth: true, title: '待收款-对账收款'}
  },
  {
    path: '/finance-manage/mon-pay-freight',
    name: 'MonPayFreight',
    component: () => import('@/views/FinanceManage/MonPayFreight/MonPayFreight'),
    meta: {auth: true, title: '月结运费'}
  },
  {
    path: '/finance-manage/settle-for-customer',
    name: 'SettleForCustomer',
    component: () => import('@/views/FinanceManage/SettleForCustomer/SettleForCustomer'),
    meta: {auth: true, title: '向客户结算'}
  },
  {
    path: '/finance-manage/for-customer-tab',
    name: 'ForCustomerTab',
    component: () => import('@/views/FinanceManage/SettleForCustomer/ForCustomerTab'),
    meta: {auth: true, title: '向客户-对账结算'}
  },
  {
    path: '/finance-manage/settle-for-start-dc',
    name: 'SettleForStartDc',
    component: () => import('@/views/FinanceManage/SettleForStartDc/SettleForStartDc'),
    meta: {auth: true, title: '待交款'}
  },
  {
    path: '/finance-manage/settle-for-start-dc-detail',
    name: 'SettleForStartDcDetail',
    component: () => import('@/views/FinanceManage/SettleForStartDc/SettleForStartDcDetail'),
    meta: {auth: true, title: '待交款明细'}
  },
  {
    path: '/finance-manage/freight-settle',
    name: 'FreightSettle',
    component: () => import('@/views/FinanceManage/FreightSettle/FreightSettle'),
    meta: {auth: true, title: '运费结算'}
  },
  {
    path: '/finance-manage/freight-settle-detail',
    name: 'FreightSettleDetail',
    component: () => import('@/views/FinanceManage/FreightSettle/FreightSettleDetail'),
    meta: {auth: true, title: '运费结算明细'}
  },
  {
    path: '/finance-manage/cash-dpt-mge',
    name: 'CashDptMge',
    component: () => import('@/views/FinanceManage/CashDptMge/CashDptMge'),
    meta: {auth: true, title: '保证金管理'}
  },
  {
    path: '/finance-manage/cash-dpt-mge-detail',
    name: 'CashDptMgeDetail',
    component: () => import('@/views/FinanceManage/CashDptMge/CashDptMgeDetail'),
    meta: {auth: true, title: '保证金管理明细'}
  },

  // 基础管理
  {
    path: '/basic-manage/dc-manage',
    name: 'DcManage',
    component: () => import('@/views/BasicManage/DcManage/DcManage'),
    meta: {auth: true, title: '分拨中心管理'}
  },
  {
    path: '/basic-manage/create-dc',
    name: 'CreateDc',
    component: () => import('@/views/BasicManage/DcManage/CreateDc'),
    meta: {auth: true, title: '新建分拨中心'}
  },
  {
    path: '/basic-manage/staff-manage',
    name: 'StaffManage',
    component: () => import('@/views/BasicManage/StaffManage/StaffManage'),
    meta: {auth: true, title: '员工管理'}
  },
  {
    path: '/basic-manage/create-staff',
    name: 'CreateStaff',
    component: () => import('@/views/BasicManage/StaffManage/CreateStaff'),
    meta: {auth: true, title: '新建员工'}
  },
  {
    path: '/basic-manage/logistics-manage',
    name: 'LogisticsManage',
    component: () => import('@/views/BasicManage/LogisticsManage/LogisticsManage'),
    meta: {auth: true, title: '物流公司管理'}
  },
  {
    path: '/basic-manage/create-logistics',
    name: 'CreateLogistics',
    component: () => import('@/views/BasicManage/LogisticsManage/CreateLogistics'),
    meta: {auth: true, title: '新建物流公司'}
  },
  {
    path: '/basic-manage/transport-manage',
    name: 'TransportManage',
    component: () => import('@/views/BasicManage/TransportManage/TransportManage'),
    meta: {auth: true, title: '运力管理'}
  },
  {
    path: '/basic-manage/create-transport',
    name: 'CreateTransport',
    component: () => import('@/views/BasicManage/TransportManage/CreateTransport'),
    meta: {auth: true, title: '新建运力'}
  },
  {
    path: '/basic-manage/customer-path-manage',
    name: 'CustomerPathManage',
    component: () => import('@/views/BasicManage/CustomerPathManage/CustomerPathManage'),
    meta: {auth: true, title: '配送线路管理'}
  },
  {
    path: '/basic-manage/create-pustomer-path',
    name: 'CreateCustomerPath',
    component: () => import('@/views/BasicManage/CustomerPathManage/CreateCustomerPath'),
    meta: {auth: true, title: '新建配送线路'}
  },
  {
    path: '/basic-manage/special-path-manage',
    name: 'SpecialPathManage',
    component: () => import('@/views/BasicManage/SpecialPathManage/SpecialPathManage'),
    meta: {auth: true, title: '专线线路管理'}
  },
  {
    path: '/basic-manage/create-spicial-path',
    name: 'CreateSpicialPath',
    component: () => import('@/views/BasicManage/SpecialPathManage/CreateSpicialPath'),
    meta: {auth: true, title: '新建专线线路'}
  },
  {
    path: '/basic-manage/route-manage',
    name: 'RouteManage',
    component: () => import('@/views/BasicManage/RouteManage/RouteManage'),
    meta: {auth: true, title: '路由管理'}
  },
  {
    path: '/basic-manage/create-route',
    name: 'CreateRoute',
    component: () => import('@/views/BasicManage/RouteManage/CreateRoute'),
    meta: {auth: true, title: '新建路由'}
  },
  {
    path: '/basic-manage/customer-manage',
    name: 'CustomerManage',
    component: () => import('@/views/BasicManage/CustomerManage/CustomerManage'),
    meta: {auth: true, title: '客户管理'}
  },
  {
    path: '/basic-manage/create-customer',
    name: 'CreateCustomer',
    component: () => import('@/views/BasicManage/CustomerManage/CreateCustomer'),
    meta: {auth: true, title: '客户管理'}
  },
  {
    path: '/personal-manage/dc-personal-center',
    name: 'DcPersonalCenter',
    component: () => import('@/views/PersonalManage/DcPersonalCenter/DcPersonalCenter'),
    meta: {auth: true, title: '个人中心'}
  },
  {
    path: '/personal-manage/opcoy-personal-center',
    name: 'OpcoyPersonalCenter',
    component: () => import('@/views/PersonalManage/OpcoyPersonalCenter/OpcoyPersonalCenter'),
    meta: {auth: true, title: '个人中心'}
  },

  // 基础数据
  {
    path: '/basic-data/all-waybill',
    name: 'PfAllWaybill',
    component: () => import('@/views/BasicData/PfAllWaybill/PfAllWaybill'),
    meta: {auth: true, title: '全部运单'}
  },
  {
    path: '/basic-data/waybill-detail',
    name: 'PfWaybillDetail',
    component: () => import('@/views/BasicData/PfAllWaybill/PfWaybillDetail'),
    meta: {auth: true, title: '运单详情'}
  },
  {
    path: '/basic-data/cash-dpt-mge',
    name: 'PfCashDptMge',
    component: () => import('@/views/BasicData/PfCashDptMge/PfCashDptMge'),
    meta: {auth: true, title: '保证金管理'}
  },
  {
    path: '/basic-data/cash-dpt-mge-detail',
    name: 'PfCashDptMgeDetail',
    component: () => import('@/views/BasicData/PfCashDptMge/PfCashDptMgeDetail'),
    meta: {auth: true, title: '保证金管理明细'}
  }
]

let router = new Router({
  // mode: 'history',
  history: false,
  hashbang: true,
  base: process.env.ROUTER_BASE,
  routes
})

router.beforeEach((to, from, next) => {
  // 路由进入控制
  if (to.name === 'CreateStaff' && to.query.type === 'edit') {
    document.title = '修改员工'
  } else if (to.name === 'CreateStaff' && to.query.type === 'check') {
    document.title = '查看员工'
  } else if (to.name === 'CreateLogistics' && to.query.type === 'edit') {
    document.title = '修改物流公司'
  } else if (to.name === 'CreateLogistics' && to.query.type === 'check') {
    document.title = '查看物流公司'
  } else if (to.name === 'CreateTransport' && to.query.type === 'edit') {
    document.title = '修改运力'
  } else if (to.name === 'CreateTransport' && to.query.type === 'check') {
    document.title = '查看运力'
  } else if (to.name === 'CreateCustomerPath' && to.query.type === 'edit') {
    document.title = '修改客户线路'
  } else if (to.name === 'CreateCustomerPath' && to.query.type === 'check') {
    document.title = '查看客户线路'
  } else if (to.name === 'CreateSpicialPath' && to.query.type === 'edit') {
    document.title = '修改专线线路'
  } else if (to.name === 'CreateSpicialPath' && to.query.type === 'check') {
    document.title = '查看专线线路'
  } else if (to.name === 'CreateRoute' && to.query.type === 'edit') {
    document.title = '修改路由'
  } else if (to.name === 'CreateRoute' && to.query.type === 'check') {
    document.title = '查看路由'
  } else if (to.name === 'CreateCustomer' && to.query.type === 'edit') {
    document.title = '修改客户'
  } else if (to.name === 'CreateCustomer' && to.query.type === 'check') {
    document.title = '查看客户'
  } else if (to.name === 'FicWbillDetail' && to.query.waybillTitle === '全部运单') {
    document.title = '全部运单详情'
  } else if (to.name === 'FicWbillDetail' && to.query.waybillTitle === '已完结运单') {
    document.title = '已完结运单详情'
  } else if (to.name === 'FicWbillDetail' && to.query.waybillTitle === '运费结算') {
    document.title = '运费结算运单详情'
  } else if (to.name === 'FicWbillDetail' && to.query.waybillTitle === '月结运费') {
    document.title = '月结运费运单详情'
  } else if (to.name === 'FicWbillDetail' && to.query.waybillTitle === '待交款') {
    document.title = '待交款运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '全部运单') {
    document.title = '全部运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '待发货运单') {
    document.title = '待发货运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '运输中运单') {
    document.title = '运输中运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '已签收运单') {
    document.title = '已签收运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '已关闭运单') {
    document.title = '已关闭运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '待接货运单') {
    document.title = '待接货运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '待调度运单') {
    document.title = '待调度运单详情'
  } else {
    document.title = to.meta.title
  }
  next()
})
router.afterEach((to, from, next) => {

})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
