import { Post, Get, PostFromData } from '@/api/axios.config'

const OrderBlankAjax = {
  QueryList (params) {
    // 配货单列表
    let result = Post('/dc/shift/run/delivery/list', params)
    return result
  },
  QueryDeliveryInfo (params) {
    // 配货单详情列表
    let result = Get('/dc/shift/run/delivery/detail/list', params)
    return result
  },
  GetPrintInfo (params) {
    // 配货单打印信息
    let result = Get('/dc/shift/run/delivery/print', params)
    return result
  },
  Departure (params) {
    // 发车
    let result = Get('/dc/shift/run/departure', params)
    return result
  },
  BatchPrintWaybill (params) {
    // 配货单管理-勾选打印
    let result = PostFromData('/dc/waybill/query/distribution/manager/print', params)
    return result
  }
}

export default OrderBlankAjax
