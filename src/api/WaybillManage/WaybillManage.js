import { Post, PostFromData, Get } from '@/api/axios.config'

const WaybillManageAjax = {
  QueryWaybillList (params) {
    // 查询分拨中心下运单列表
    let result = Post('/dc/waybill/query/list', params)
    return result
  },
  QueryOcAndPfWbill (params) {
    // 查询运营和平台下全部运单列表
    let result = Post('/dc/waybill/query/all', params)
    return result
  },
  Cancel (params) {
    // 运单取消
    let result = PostFromData('/dc/waybill/transport/cancel', params)
    return result
  },
  Reject (params) {
    // 运单拒签
    let result = PostFromData('/dc/waybill/transport/refusal', params)
    return result
  },
  Sign (params) {
    // 运单签收
    let result = PostFromData('/dc/waybill/transport/signing', params)
    return result
  },
  Receive (params) {
    // 运单接货
    let result = PostFromData('/dc/waybill/transport/receive', params)
    return result
  },
  QueryPickWaybillList (params) {
    // 待接货运单列表
    let result = Post('/dc/waybill/query/pickup/list', params)
    return result
  },
  QueryOpCoyList (params) {
    // 获取下拉框(运营公司列表)
    let result = Post('/dc/company/query/operationCompanyList', params)
    return result
  },
  QueryLogisticsList (params) {
    // 获取下拉框(关联物流列表)
    let result = Post('/dc/company/query/logisticsCompanyList', params)
    return result
  },
  QueryDcList (params) {
    // 获取下拉框(分拨中心列表)
    let result = Post('/dc/line/query/cdIdAndNameList', params)
    return result
  },
  QuerySendDcList (params) {
    // 获取专线发货分拨中心
    let result = Get('/dc/info/sendDc/query', params)
    return result
  },
  QueryTranspList (params) {
    // 获取下拉框(运力列表)
    let result = Post('/dc/line/query/lineTransportCapacityList', params)
    return result
  },
  QueryWbillDetail (params) {
    // 查询PC运单详情
    let result = PostFromData('/dc/waybill/PcDcWaybillInfo', params)
    return result
  },
  GetNewWaybillClient (params) {
    // 查询开单客户列表
    let result = Get('/dc/client/all', params)
    return result
  },
  QueryNewWaybillLineAndShift (params) {
    // 查询开单线路班次信息
    let result = Get('/dc/line/waybill/shift/query', params)
    return result
  },
  CreatWaybill (params) {
    // 创建运单
    let result = Post('/dc/waybill/create', params)
    return result
  },
  QueryWaybillPrintInfo (params) {
    // 打印运单数据接口
    let result = Get('/dc/waybill/app/queryBoxPrintData', params)
    return result
  },
  QueryBoxInfo (params) {
    // 根据运单ID查询箱单信息
    let result = Get('/dc/waybill/query/box/info', params)
    return result
  },
  QueryBoxbillPrintInfo (params) {
    // 打印箱单数据接口
    let result = PostFromData('/dc/waybill/query/info/boxes/print', params)
    return result
  }
}

export default WaybillManageAjax
