import { Post, Get, PostFromData } from '@/api/axios.config'

const SpecialPathAjax = {
  InsertSpecialLine (params) {
    // 专线线路新增
    let result = Post('/dc/line/insert/insertDedicatesLine', params)
    return result
  },
  QueryList (params) {
    // 专线线路管理
    let result = Post('/dc/line/query/dedicated/line/list', params)
    return result
  },
  UpdateSpecialLine (params) {
    // 专线线路修改
    let result = Post('/dc/line/update/DedicatesLine', params)
    return result
  },
  QuerySpecialLineInfo (params) {
    //  专线线路修改回显
    let result = Get('/dc/line/update/updateDedicatesLineEcho', params)
    return result
  },
  UpdateSpecialLineStatus (params) {
    // 禁用/启用状态
    let result = PostFromData('/dc/line/update/updateLineStatus', params)
    return result
  }
}

export default SpecialPathAjax
