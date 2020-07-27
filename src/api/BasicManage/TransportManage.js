import { Post, Get, PostFromData } from '@/api/axios.config'

const TransportManageAjax = {
  InsertTransport (params) {
    // 运力新增
    let result = Post('dc/transport/capacity/insert/insertTransportCapacity', params)
    return result
  },
  QueryList (params) {
    // 运力中心列表
    let result = Post('/dc/transport/capacity/query/list', params)
    return result
  },
  UpdateTransport (params) {
    // 运力中心修改
    let result = Post('/dc/transport/capacity/update/updateTransportCapacity', params)
    return result
  },
  QueryTransportInfo (params) {
    // 运力中心修改回显
    let result = Get('/dc/transport/capacity/update/updateTransportCapacityEcho', params)
    return result
  },
  UpdateTransportStatus (params) {
    // 禁用/启用运力中心状态
    let result = Post('/dc/transport/capacity/update/updateDcInfoStatus', params)
    return result
  },
  ResetTransPwd (params) {
    // 重置密码
    let result = PostFromData('/dc/transport/capacity/password/tc/reset', params)
    return result
  }
}

export default TransportManageAjax
