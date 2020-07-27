import { Post, PostFromData } from '@/api/axios.config'

const MonPayFreightAjax = {
  QueryList (params) {
    // 查询月结运费列表
    let result = Post('/dc/waybill/collect/monthFreight', params)
    return result
  },
  SureReceipt (params) {
    // 确认收款
    let result = PostFromData('/dc/waybill/collect/receipt', params)
    return result
  }
}

export default MonPayFreightAjax
