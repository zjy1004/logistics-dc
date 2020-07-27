import { Post, Get } from '@/api/axios.config'

const LogisticsManageAjax = {
  InsertLogistics (params) {
    // 物流公司新增
    let result = Post('/dc/company/insert/insertDcCompany', params)
    return result
  },
  QueryList (params) {
    // 物流公司列表
    let result = Post('/dc/company/query/list', params)
    return result
  },
  UpdateLogistics (params) {
    // 物流公司修改
    let result = Post('/dc/company/update/updateDcCompany', params)
    return result
  },
  QueryLogisticsInfo (params) {
    // 物流公司修改回显
    let result = Get('/dc/company/update/updateDcCompanyEcho', params)
    return result
  },
  UpdateLogisticsStatus (params) {
    // 禁用/启用物流公司状态
    let result = Post('/dc/company/update/updateDcInfoStatus', params)
    return result
  }
}

export default LogisticsManageAjax
