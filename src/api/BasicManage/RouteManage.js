import { Post, Get, PostFromData } from '@/api/axios.config'

const RouteManageAjax = {
  InsertRoute (params) {
    // 路由配置管理新增
    let result = Post('/dc/router/line/insert/routerLine', params)
    return result
  },
  QueryLineAndEndDc (params) {
    // 根据上游分拨中心查询下游详情
    let result = PostFromData('/dc/router/line/queryEndDcNameAndInfoVoList', params)
    return result
  },
  QueryDcByLine (params) {
    // 根据线路id查询下游分拨中心详情
    let result = PostFromData('/dc/router/line/queryEndDcNameByLineIdList', params)
    return result
  },
  QueryList (params) {
    // 路由管理列表
    let result = Post('/dc/router/line/query/router/line/list', params)
    return result
  },
  UpdateRoute (params) {
    // 路由配置修改
    let result = Post('/dc/router/line/update/updateRouterLine', params)
    return result
  },
  QueryRouteInfo (params) {
    // 路由配置修改回显
    let result = Get('/dc/router/line/update/updateRouterLineEcho', params)
    return result
  },
  UpdateRouteStatus (params) {
    // 禁用/启用路由状态
    let result = PostFromData('/dc/router/line/update/updateStatus', params)
    return result
  }
}

export default RouteManageAjax
