<template>
  <div class="auto-left-nav">
    <el-menu :default-active="activeName" class="el-menu-vertical-demo"
    :text-color="textColor"
    :active-text-color="activeTtextColor"
    :unique-opened="uniqueOpened"
    :router="isRouter"
    @open="handleOpen" @close="handleClose" :collapse="isCollapse">
    <!-- 运单管理 -->
      <template>
        <div v-show="hasMenuPermission('1') && topTabMenuIndex === '1'">
          <el-menu-item v-show="hasMenuPermission('1', 'NewWaybill')" index="/waybill-manage/new-waybill">
            <span slot="title">新建运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('1', 'AllWaybill')" index="/waybill-manage/all-waybill">
            <span slot="title">全部运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('1', 'StaySendWaybill')" index="/waybill-manage/stay-send-Waybill">
            <span slot="title">待发货运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('1', 'TransportWaybill')" index="/waybill-manage/transport-waybill">
            <span slot="title">运输中运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('1', 'HaveSignedWaybill')" index="/waybill-manage/have-signed-waybill">
            <span slot="title">已签收运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('1', 'HaveCloseWaybill')" index="/waybill-manage/have-close-waybill">
            <span slot="title">已关闭运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('1', 'StayMakeCargoWaybill')" index="/waybill-manage/stay-make-cargo-waybill">
            <span slot="title">待接货运单</span>
          </el-menu-item>
        </div>
      </template>

      <!-- 调度管理 -->
      <template>
        <div v-show="hasMenuPermission('4') && topTabMenuIndex === '4'">
          <el-menu-item v-show="hasMenuPermission('4', 'ShiftPlanManage')" index="/dispatch-manage/shift-plan-manage">
            <span slot="title">班次计划管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('4', 'OrderBlankManage')" index="/dispatch-manage/order-blank-manage">
            <span slot="title">配货单管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('4', 'StayDispatchBill')" index="/dispatch-manage/stay-dispatch-bill">
            <span slot="title">待调度运单</span>
          </el-menu-item>
        </div>
      </template>

      <!-- 财务管理 -->
      <template>
        <div v-show="hasMenuPermission('3') && topTabMenuIndex === '3'">
          <el-submenu v-show="hasMenuPermission('3', 'FicWbillMge')" index= '30'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">财务运单管理</span>
            <el-menu-item v-show="hasMenuPermission('3', 'FicAllWbill')" index="/finance-manage/fic-all-wbill">
              <span slot="title">全部运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'FicFinishWbill')" index="/finance-manage/fic-finish-wbill">
              <span slot="title">已完结运单</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu v-show="hasMenuPermission('3', 'FincReceipt')" index= '31'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">财务收款</span>
            <el-menu-item v-show="hasMenuPermission('3', 'StayReceipt')" index="/finance-manage/stay-receipt">
              <span slot="title">待收款</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'MonPayFreight')" index="/finance-manage/mon-pay-freight">
              <span slot="title">月结运费</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu v-show="hasMenuPermission('3', 'FincSettle')" index= '32'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">财务结算</span>
            <el-menu-item v-show="hasMenuPermission('3', 'SettleForCustomer')" index="/finance-manage/settle-for-customer">
              <span slot="title">向客户结算</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'SettleForStartDc')" index="/finance-manage/settle-for-start-dc">
              <span slot="title">待交款</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'FreightSettle')" index="/finance-manage/freight-settle">
              <span slot="title">运费结算</span>
            </el-menu-item>
          </el-submenu>
            <el-menu-item v-show="hasMenuPermission('3', 'CashDptMge')" index="/finance-manage/cash-dpt-mge">
              <span slot="title">保证金管理</span>
            </el-menu-item>
        </div>
      </template>

      <!-- 基础管理 -->
      <template>
        <div v-show="hasMenuPermission('2') && topTabMenuIndex === '2'">
          <el-menu-item v-show="hasMenuPermission('2', 'DcManage')" index="/basic-manage/dc-manage">
            <span slot="title">分拨中心管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'StaffManage')" index="/basic-manage/staff-manage">
            <span slot="title">员工管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'LogisticsManage')" index="/basic-manage/logistics-manage">
            <span slot="title">物流公司管理</span>
          </el-menu-item>
           <el-menu-item v-show="hasMenuPermission('2', 'TransportManage')" index="/basic-manage/transport-manage">
            <span slot="title">运力管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'CustomerPathManage')" index="/basic-manage/customer-path-manage">
            <span slot="title">配送线路管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'SpecialPathManage')" index="/basic-manage/special-path-manage">
            <span slot="title">专线线路管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'RouteManage')" index="/basic-manage/route-manage">
            <span slot="title">路由管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'CustomerManage')" index="/basic-manage/customer-manage">
            <span slot="title">客户管理</span>
          </el-menu-item>
        </div>
      </template>

      <!-- 基础数据 -->
      <template>
        <div v-show="hasMenuPermission('5') && topTabMenuIndex === '5'">
          <el-menu-item v-show="hasMenuPermission('5', 'PfAllWaybill')" index="/basic-data/all-waybill">
            <span slot="title">全部运单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('5', 'PfCashDptMge')" index="/basic-data/cash-dpt-mge">
            <span slot="title">保证金管理</span>
          </el-menu-item>
        </div>
      </template>

      <!-- 运单管理 -->
      <!-- <template>
        <div v-show="topTabMenuIndex === '1'">
          <el-submenu v-show="hasMenuPermission('1', 'createBill')" index= '11'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">新建运单</span>
            <el-menu-item v-show="hasMenuPermission('1', 'NewWaybill', 'add')" index="/waybill-manage/new-waybill?index=add">
              <span slot="title">新建运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'NewWaybill', 'revoke')" index="/waybill-manage/new-waybill?index=revoke">
              <span slot="title">退货运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'NewWaybill', 'tracking')" index="/waybill-manage/new-waybill?index=tracking">
              <span slot="title">补录运单</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu v-show="hasMenuPermission('1', 'sendGoodsBill')" index= '33'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">发货单管理</span>
            <el-menu-item v-show="hasMenuPermission('1', 'AllWaybill', '0')" index="/waybill-manage/all-waybill?index=0">
              <span slot="title">全部运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'AllWaybill', '1')" index="/waybill-manage/all-waybill?index=1">
              <span slot="title">待发货运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'AllWaybill', '2')" index="/waybill-manage/all-waybill?index=2">
              <span slot="title">运输中运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'AllWaybill', '3')" index="/waybill-manage/all-waybill?index=3">
              <span slot="title">已签收运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'AllWaybill', '4')" index="/waybill-manage/all-waybill?index=4">
              <span slot="title">已关闭运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'DistributorWaybillManageList')" index="/waybill-manage/distributor-waybill-manage-list">
              <span slot="title">全部运单</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu v-show="hasMenuPermission('1', 'returnBill')" index= '22'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">退货单管理</span>
            <el-menu-item v-show="hasMenuPermission('1', 'returnWaybill', 'prepareForStorage')" index="/waybill-manage/return-goods-list?index=prepareForStorage">
              <span slot="title">待入库运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'returnWaybill', 'prepareForReturn')" index="/waybill-manage/return-goods-list?index=prepareForReturn">
              <span slot="title">待退货运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'returnWaybill', 'prepareForStorageComplete')" index="/waybill-manage/return-goods-list?index=prepareForStorageComplete">
              <span slot="title">已完成运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'returnWaybill', 'cancel')" index="/waybill-manage/return-goods-list?index=cancel">
              <span slot="title">已取消运单</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu v-show="hasMenuPermission('1', 'statistics')" index= '12'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">运单统计</span>
            <el-menu-item v-show="hasMenuPermission('1', 'statisticsWaybill', 'send')" index="/waybill-manage/waybill-statistics-list?index=send">
              <span slot="title">发货运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'statisticsWaybill', 'revoke')" index="/waybill-manage/waybill-statistics-list?index=revoke">
              <span slot="title">退货运单</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu v-show="hasMenuPermission('1', 'dispatchWaybillManage')" index= '13'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">调度运单管理</span>
            <el-menu-item v-show="hasMenuPermission('1', 'dispatchWaybillList')" index="/waybill-manage/dispatch-waybill-list">
              <span slot="title">调度运单查询</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('1', 'ToReceiveWaybillList')" index="/waybill-manage/to-receive-waybill-List">
              <span slot="title">待接收运单</span>
            </el-menu-item>
          </el-submenu>
        </div>
      </template> -->

      <!-- 运营路线 -->
      <!-- <template>
        <div v-show="hasMenuPermission('2') && topTabMenuIndex === '2'">
          <el-menu-item v-show="hasMenuPermission('2', 'ShiftPlan')" index="/operation-course/shift-plan">
            <span slot="title">班次计划管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2', 'PrintPickingBill')" index="/operation-course/print-picking-bill">
            <span slot="title">打印配货单</span>
          </el-menu-item>
        </div>
      </template> -->

      <!-- 基本管理 -->
      <!-- <template>
        <div v-show="hasMenuPermission('3') && topTabMenuIndex === '3'">
          <el-menu-item v-show="hasMenuPermission('3', 'RoleManage')" index="/basic-manage/role-manage">
            <span slot="title">角色管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'SiteManage')" index="/basic-manage/site-manage">
            <span slot="title">站点管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'CarManage')" index="/basic-manage/car-manage">
            <span slot="title">车辆管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'LogisticsStaffList')" index="/basic-manage/logistics-staff-manage">
            <span slot="title">物流员工管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'CreatCustomerLine')" index="/basic-manage/customer-route">
            <span slot="title">客户线路</span>
          </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'LogisticsCompanyManage')" index="/basic-manage/logistics-company-manage">
              <span slot="title">物流公司管理</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'CustomerManage')" index="/basic-manage/customer-manage">
              <span slot="title">客户管理<el-badge v-show="customerBadgeNum > 0" class="nark" :value="customerBadgeNum" :max="99"/></span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'configurationOfJointBusiness')" index="/basic-manage/configuration-of-joint-business">
              <span slot="title">联营业务配置</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'JointLine')" index="/basic-manage/joint-line-list">
              <span slot="title">联营线路</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('3', 'jointRouteConfig')" index="/basic-manage/configuration-of-joint-route">
              <span slot="title">联营路由配置</span>
            </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'ProprietaryLine')" index="/basic-manage/proprietary-line-list">
            <span slot="title">自营线路</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'JoinDispatchLine') && hasJoint" index="/basic-manage/join-dispatch-line-list">
            <span slot="title">联营调度线路</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'SelfRouteConfig')" index="/basic-manage/self-route-config">
            <span slot="title">自营路由配置</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'JoinRouteInfo') && hasJoint" index="/basic-manage/join-route-info">
            <span slot="title">联营路由信息</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'InwardUserManage')" index="/basic-manage/inward-user-manage">
            <span slot="title">内部用户管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'OrganizationManage')" index="/basic-manage/organization-manage">
            <span slot="title">组织管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'ChangePassword')" index="/personal-manage/edit-password">
            <span slot="title">修改密码</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'PersonalInfoLogisticsCompany')" index="/personal-manage/personal-info-logistics-company">
            <span slot="title">个人信息</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3', 'PersonalInfoLogisticsStaff')" index="/personal-manage/personal-info-logistics-staff">
            <span slot="title">个人信息</span>
          </el-menu-item>
        </div>
      </template> -->

      <!-- 财务管理 -->
      <!-- <template>
        <div v-show="hasMenuPermission('4') && topTabMenuIndex === '4'">
          <el-submenu v-show="hasMenuPermission('4', 'WaybillManage')" index= '20'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">财务运单管理</span>
            <el-menu-item v-show="hasMenuPermission('4', 'FinancWaybillLists', '0')" index="/financing-manage/financ-waybill-list?index=0">
              <span slot="title">全部运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'FinancWaybillLists', '1')" index="/financing-manage/financ-waybill-list?index=1">
              <span slot="title">待收款运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'FinancWaybillLists', '3')" index="/financing-manage/financ-waybill-list?index=3">
              <span slot="title">已完结运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'ReceiptAdjust')" index="/financing-manage/receipt-adjust">
              <span slot="title">收款调整</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu v-show="hasMenuPermission('4', 'financeReceipt')" index= '21'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">财务收款</span>
            <el-menu-item v-show="hasMenuPermission('4', 'ReceiptFromStaff')" index="/financing-manage/receipt-from-staff-list">
              <span slot="title">向员工收款</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'ReceiptfromBeBornWith')" index="/financing-manage/receiptfrom-be-born-with-list">
              <span slot="title">向落地配收款</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'MonthlyFreight')" index="/financing-manage/monthly-freight">
              <span slot="title">运费结算</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu v-show="hasMenuPermission('4', 'financeSettlement')" index= '22'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">结算支出</span>
            <el-menu-item v-show="hasMenuPermission('4', 'SettlementForCustomersList')" index="/financing-manage/settlement-for-customersList">
              <span slot="title">给客户结算</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'OutstandingWaybill')" index="/financing-manage/outstanding-waybill">
              <span slot="title">待支付运单</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('4', 'PaymentHistory')" index="/financing-manage/payment-history">
              <span slot="title">支付记录</span>
            </el-menu-item>
          </el-submenu>
        </div>
      </template> -->

      <!-- 服务中心 -->
      <!-- <template>
        <div v-show="hasMenuPermission('5') && topTabMenuIndex === '5'">
          <el-menu-item  v-show="hasMenuPermission('5', 'LogisticsPayConfig')" index="/service-center/logistics-pay-detail">
            <span slot="title">驮付宝配置</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('5', 'FundsAccount')" index="/service-center/funds-account">
            <span slot="title">资金账户</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('5', 'DealerAccount')" index="/service-center/dealer-account">
            <span slot="title">资金账户</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('5', 'OnLineBookkeepingFlow')" index="/service-center/bookkeeping-flow-list">
            <span slot="title">在线支付记账流水</span>
          </el-menu-item>
        </div>
      </template> -->

      <!-- 系统后台 -->
      <!-- <template>
        <div v-show="hasMenuPermission('99') && topTabMenuIndex === '99'">
          <el-menu-item v-show="hasMenuPermission('99', 'MenuManage')" index="/system-manage/menu-manage">
            <span slot="title">菜单管理</span>
          </el-menu-item>
        </div>
      </template> -->

      <!-- 运营统计 -->
      <!-- <template>
        <div v-show="hasMenuPermission('6') && topTabMenuIndex === '6'">
          <el-menu-item v-show="hasMenuPermission('6', 'PlatformDataStatistics')" index="/operation-statistics/platform-data-statistics">
            <span slot="title">平台数据统计</span>
          </el-menu-item>
           <el-menu-item v-show="hasMenuPermission('6', 'BusinessDataStatistics')" index="/operation-statistics/business-data-statistics">
            <span slot="title">业务数据统计</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('6', 'WaybillExport')" index="/operation-statistics/waybill-export">
            <span slot="title">运单查询</span>
          </el-menu-item>
        </div>
      </template> -->

      <!-- 及时配送 -->
      <!-- <template>
        <div v-show="hasMenuPermission('7') && topTabMenuIndex === '7'">
          <el-submenu v-show="hasMenuPermission('7', 'CreateTask')" index= '23'>
            <span slot="title" style="font-size: 14px;font-weight: bold;">创建任务</span>
            <el-menu-item v-show="hasMenuPermission('7', 'CollectTask')" index="/timely-delivery/creat-tasks/collect-task">
              <span slot="title">揽收任务</span>
            </el-menu-item>
            <el-menu-item v-show="hasMenuPermission('7', 'DeliveryTask')" index="/timely-delivery/creat-tasks/delivery-task">
              <span slot="title">配送任务</span>
            </el-menu-item>
          </el-submenu>
           <el-menu-item v-show="hasMenuPermission('7', 'StationOrder')" index="/timely-delivery/station-order">
            <span slot="title">站点开单</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('7', 'WaybillManage')" index="/timely-delivery/timely-waybill-manage">
            <span slot="title">运单管理</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('7', 'FreightCheck')" index="/timely-delivery/freight-check">
            <span slot="title">运费核对</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('7', 'PaymentCheck')" index="/timely-delivery/payment-check">
            <span slot="title">货款核对</span>
          </el-menu-item>
          <el-menu-item v-show="hasMenuPermission('7', 'Statistics')" index="/timely-delivery/statistics">
            <span slot="title">统计</span>
          </el-menu-item>
           <el-menu-item v-show="hasMenuPermission('7', 'LocationManage')" index="/timely-delivery/location-manage">
            <span slot="title">位置管理</span>
          </el-menu-item>
        </div>
      </template> -->
    </el-menu>
  </div>
</template>

<script>
// import CustomerManageAjax from '@/api/CustomerManage/CustomerManage'
// import CommonAxios from '@/api/Common/CommonAxios'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AutoLeftNav',
  data () {
    return {
      logisticsId: '',
      hasJoint: true,
      activeName: '',
      isCollapse: false,
      textColor: '#333333',
      activeTtextColor: '#fefeff',
      uniqueOpened: true,
      isRouter: true,
      customerBadgeNum: 0
    }
  },
  created () {
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      let userInfoObj = JSON.parse(userInfo)
      this.logisticsId = userInfoObj.logisticsId
    }
    this.getUrl()
    if (this.$route.path.match('basic-manage')) {
      // this.queryNoPerfect()
    }
    // this.queryLogisticType()
  },
  watch: {
    $route (newVal, oldVal) {
      let url = newVal.fullPath
      this.activeName = url
      if (newVal.path.match('basic-manage')) { // 基本管理
        // this.queryNoPerfect()
      }
    }
  },
  computed: {
    ...mapState({
      topTabMenuIndex: state => state.topTabMenuIndex
    }),
    ...mapGetters(['hasMenuPermission'])
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    getUrl () {
      let self = this
      let currentUrl = window.location.href
      self.activeName = currentUrl.split('#')[1]
    }
    // queryNoPerfect () {
    //   CustomerManageAjax.QueryNotPerfectNum().then(res => {
    //     if (res.code === 200) {
    //       this.customerBadgeNum = res.data
    //     }
    //   })
    // },
    // 查询物流公司是联营还是自营
    // queryLogisticType () {
    //   CommonAxios.QueryLogisticType({logisticsId: this.logisticsId || ''}).then(response => {
    //     if (response.code === 200) {
    //       if (response.data > 0) { // 有联营关系
    //         this.hasJoint = true
    //       }
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less">
@import '../../style/base.less';
.auto-left-nav{
  width: 180px;
  display: flex;
  flex-direction: column;
  span{
    font-size: 14px;
    color: #B0B0B0;
  }
  .menuHiden {
  .el-submenu__title {
      height: 0;
      line-height: 0;
    }
    .el-menu {
      display: block !important;
    }
  }
  .el-submenu__title {
    // padding: 0 30px !important;
  }
  .el-menu-item {
    // padding: 0 40px !important;
  }
  .el-menu-item.is-active{
    background: #000;
    span{
      color: #fff;
    }
  }
  .el-badge{
    margin-left: 30px;
  }
  .el-badge__content{
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    padding: 0px;
    margin-top: -5px;
  }
}
</style>
<style lang="less" scoped>
@import '../../style/base.less';
.auto-left-nav{
  ul{
    height: 100%;
  }
}
</style>
