import { Get, Post } from '@/api/axios.config'

const PersonalManageAjax = {
  GetDcPersonalInfo (params) {
    // 查询pc端分拨中心登陆个人信息
    let result = Get('/dc/account/pc/dcLogin/info/query', params)
    return result
  },
  GetOpcoyPersonalInfo (params) {
    // 查询pc端运营公司登陆个人信息
    let result = Get('/dc/account/pc/dc/info/query', params)
    return result
  },
  UpdatePsd (params) {
    // 修改密码
    let result = Post('/dc/auth/password/update', params)
    return result
  }
}

export default PersonalManageAjax
