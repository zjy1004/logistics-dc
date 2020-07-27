import { Get, Post, PostFromData } from '@/api/axios.config'

const FicAllWbillAjax = {
  QueryList (params) {
    // 财务全部运单列表
    let result = Post('/dc/waybill/finance/list', params)
    return result
  },
  QueryLineList (params) {
    // 分拨中心下所有线路下拉框
    let result = Get('/dc/line/dc/all/contain/router', params)
    return result
  },
  QueryRoleDcList (params) {
    // 下拉框(分拨中心下拉框区分角色)
    let result = PostFromData('/dc/line/query/cdIdAndNameListByRoleType', params)
    return result
  }
}

export default FicAllWbillAjax
