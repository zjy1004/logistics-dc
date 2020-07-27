import { Post, Get, PostFromData } from '@/api/axios.config'

const StayDispatchAjax = {
  QueryDispatchWaybillList (params) {
    // 查询待调度运单列表
    let result = Post('/dc/waybill/query/wait/dispatch/list', params)
    return result
  },
  Dispatch (params) {
    // 运单调度
    let result = PostFromData('/dc/waybill/transport/dispatch', params)
    return result
  },
  QueryDispatchLine (params) {
    // 查询当天可调度线路
    let result = Get('/dc/line/waybill/dispatch', params)
    return result
  }
}

export default StayDispatchAjax
