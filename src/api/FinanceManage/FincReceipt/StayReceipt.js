import { Get, Post, PostFromData } from '@/api/axios.config'

const StayReceiptAjax = {
  QueryList (params) {
    // 待收款
    let result = Post('/dc/waybill/collect/list', params)
    return result
  },
  SureReceipt (params) {
    // 确认收款
    let result = PostFromData('/dc/waybill/collect/receipt', params)
    return result
  },
  ReceiptTab (params) {
    // 对账列表
    let result = Post('/dc/waybill/collect/reconciliation/list', params)
    return result
  },
  QueryPayUser (params) {
    // 交款人下拉框
    let result = Get('/dc/waybill/collect/payUser', params)
    return result
  }
}

export default StayReceiptAjax
