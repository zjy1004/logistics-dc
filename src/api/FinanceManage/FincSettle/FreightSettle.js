import { Get, Post, PostFromData } from '@/api/axios.config'

const FreightSettletAjax = {
  QueryList (params) {
    // 运费结算列表
    let result = Post('/dc/waybill/settlement/freight/list', params)
    return result
  },
  SureSettle (params) {
    // 确认结算
    let result = PostFromData('/dc/waybill/settlement/freight/settle', params)
    return result
  },
  QueryListDetail (params) {
    // 运费结算详细列表
    let result = Post('/dc/waybill/settlement/freight/detail/list', params)
    return result
  },
  QuerySettler (params) {
    // 运费结算对象下拉框
    let result = Get('/dc/waybill/settlement/freight/settleUser', params)
    return result
  }
}

export default FreightSettletAjax
