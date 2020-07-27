import { Post, Get, PostFromData } from '@/api/axios.config'

const ShiftPlanAjax = {
  QueryList (params) {
    // 班次管理列表
    let result = Post('/dc/shift/run/list', params)
    return result
  },
  QueryLineList (params) {
    // 分拨中心下所有线路下拉框
    let result = Get('/dc/line/dc/all', params)
    return result
  },
  UpdateShiftPlan (params) {
    // 班次修改
    let result = PostFromData('/dc/shift/run/update', params)
    return result
  },
  InsertShiftPlan (params) {
    // 新增临时班次
    let result = Post('/dc/shift/run/temp/insert', params)
    return result
  },
  ShiftPlanInfo (params) {
    // 班次修改回显
    let result = Post('/dc/shift/run/query/echo', params)
    return result
  },
  QueryTranspList (params) {
    // 获取获取所有运力
    let result = Get('/dc/transport/capacity/query/all', params)
    return result
  }
}

export default ShiftPlanAjax
