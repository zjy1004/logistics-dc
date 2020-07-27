import { Post, Get, PostFromData } from '@/api/axios.config'

const StaffManageAjax = {
  InsertStaff (params) {
    // 员工新增
    let result = Post('/dc/personnel/insert/insertPersonnel', params)
    return result
  },
  QueryList (params) {
    // 员工列表
    let result = Post('/dc/personnel/query/list', params)
    return result
  },
  QueryRoleDcList (params) {
    // 下拉框(分拨中心下的角色)
    let result = Post('/dc/personnel/query/dcNameRoleList', params)
    return result
  },
  UpdateStaff (params) {
    // 员工修改
    let result = Post('/dc/personnel/update/updatePersonnel', params)
    return result
  },
  QueryStaffInfo (params) {
    // 员工修改回显
    let result = Get('/dc/personnel/update/updatePersonnelEcho', params)
    return result
  },
  UpdateStaffStatus (params) {
    // 禁用/启用员工状态
    let result = PostFromData('/dc/personnel/update/updatePersonnelStatus', params)
    return result
  },
  ResetStaffPwd (params) {
    // 重置密码
    let result = PostFromData('/dc/personnel/password/reset', params)
    return result
  }
}

export default StaffManageAjax
