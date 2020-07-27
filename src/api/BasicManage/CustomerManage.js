import { Post, Get, PostFromData } from '@/api/axios.config'

const CustomerManageAjax = {
  InsertCustomer (params) {
    // 客户中心新增
    let result = Post('/dc/client/insert/insertDcClient', params)
    return result
  },
  QueryList (params) {
    // 客户中心列表
    let result = Post('/dc/client/query/clientList', params)
    return result
  },
  QueryLineList (params) {
    // 获取所有配送线路
    let result = Get('/dc/client/query/deliveryCityAll', params)
    return result
  },
  UpdateCustomer (params) {
    // 客户中心修改
    let result = Post('/dc/client/update/updateDcClient', params)
    return result
  },
  QueryCustomerInfo (params) {
    // 客户中心修改回显
    let result = Get('/dc/client/update/updateDcClientEcho', params)
    return result
  },
  UpdateCustomerStatus (params) {
    // 禁用/启用客户中心状态
    let result = PostFromData('/dc/client/update/updateDcClientStatus', params)
    return result
  },
  ResetPwd (params) {
    // 客户管理重置密码
    let result = PostFromData('/dc/client/password/client/reset', params)
    return result
  }
}

export default CustomerManageAjax
