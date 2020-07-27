import { Post, PostFromData, Get } from '@/api/axios.config'

const CashDptMgeAjax = {
  QueryList (params) {
    // 保证金列表
    let result = PostFromData('/dc/margin/query/marginList', params)
    return result
  },
  InsertCashRecord (params) {
    // 保证金管理新增
    let result = Post('/dc/margin/insert/insertDcMargin', params)
    return result
  },
  InsertDetailCash (params) {
    // 保证金管理明细新增
    let result = Post('/dc/margin/insert/insertDcDetailsMargin', params)
    return result
  },
  QueryListDetail (params) {
    // 保证金明细列表
    let result = Post('/dc/margin/query/marginDetailsList', params)
    return result
  },
  GetLogistics (params) {
    // 下拉框(关联物流列表)
    let result = Post('/dc/company/query/logisticsCompanyList', params)
    return result
  },
  GetTrans (params) {
    // 获取所有运力(实时更新+分页)
    let result = Get('/dc/transport/capacity/query/realTime/all', params)
    return result
  },
  GetMargin (params) {
    // 获取保证金
    let result = Post('/dc/margin/select/margin', params)
    return result
  },
  GetMarginById (params) {
    // 根据保证金id查询保证金金额
    let result = PostFromData('/dc/margin/select/marginById', params)
    return result
  }
}

export default CashDptMgeAjax
