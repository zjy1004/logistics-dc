import { Post, Get, PostFromData } from '@/api/axios.config'

const DcManageAjax = {
  InsertDc (params) {
    // 分拨中心新增
    let result = Post('/dc/info/insert/insertDcInfo', params)
    return result
  },
  QueryList (params) {
    // 分拨中心列表
    let result = Post('/dc/info/query/list', params)
    return result
  },
  UpdateDc (params) {
    // 分拨中心修改
    let result = Post('/dc/info/update/updateDcInfo', params)
    return result
  },
  QueryDcInfo (params) {
    // 分拨中心修改回显
    let result = Get('/dc/info/update/updateDcInfoEcho', params)
    return result
  },
  UpdateDcStatus (params) {
    // 禁用/启用分拨中心状态
    let result = PostFromData('/dc/info/update/updateDcInfoStatus', params)
    return result
  }
}

export default DcManageAjax
