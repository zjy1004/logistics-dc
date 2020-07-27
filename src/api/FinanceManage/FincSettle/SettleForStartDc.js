import { Post, Get } from '@/api/axios.config'

const SettleForStartDcAjax = {
  QueryList (params) {
    // 待交款列表
    let result = Post('/dc/waybill/collect/pay/list', params)
    return result
  },
  QueryListDetail (params) {
    // 待交款列表详细
    let result = Post('/dc/waybill/collect/pay/list/detail', params)
    return result
  },
  QueryCollectDc (params) {
    // 待交款分拨中心下拉框
    let result = Get('/dc/waybill/collect/pay/dc', params)
    return result
  }
}

export default SettleForStartDcAjax
