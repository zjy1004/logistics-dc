import { Post, Get, PostFromData } from '@/api/axios.config'

const CustomerPathAjax = {
  InsertDistributionLine (params) {
    // 配送线路新增
    let result = Post('/dc/line/insert/insertDistributionLine', params)
    return result
  },
  QueryList (params) {
    // 配送线路列表
    let result = Post('/dc/line/query/distribution/line/list', params)
    return result
  },
  UpdateDistributionLine (params) {
    // 配送线路修改
    let result = Post('/dc/line/update/updateDistributionLine', params)
    return result
  },
  QueryDistributionLineInfo (params) {
    //  配送线路回显
    let result = Get('/dc/line/update/updateDistributionLineEcho', params)
    return result
  },
  UpdateDistributionLineStatus (params) {
    // 禁用/启用状态
    let result = PostFromData('/dc/line/update/updateLineStatus', params)
    return result
  }
}

export default CustomerPathAjax
