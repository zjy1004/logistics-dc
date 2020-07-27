import { Get, Post, PostFromData } from '@/api/axios.config'

const SettleForCustomerAjax = {
  QueryList (params) {
    // 向客户结算列表
    let result = Post('/dc/waybill/settlement/client/list', params)
    return result
  },
  SureReceipt (params) {
    // 货款确认结算（给客户结算）
    let result = PostFromData('/dc/waybill/settlement/settle', params)
    return result
  },
  ReceiptTab (params) {
    // 对账列表
    let result = Post('/dc/waybill/settlement/client/list/detail', params)
    return result
  },
  QueryClients (params) {
    // 客户下拉框
    let result = Get('/dc/waybill/settlement/client', params)
    return result
  }
}

export default SettleForCustomerAjax
