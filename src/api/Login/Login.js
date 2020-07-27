import { Get, GetResponse, PostFromData } from '@/api/axios.config'

const LoginAjax = {
  Login (params) {
    // 登录
    let result = PostFromData('/dc/auth/login', params)
    return result
  },
  QueryMenus (params) {
    // 查询用户拥有的菜单
    let result = Get('/dc/auth/queryAccountMenus', params)
    return result
  },
  GetVerificationCode (params) {
    // 获取登录图片验证码
    let result = GetResponse('/captcha/generate', params)
    return result
  },
  ResetPassword (params) {
    // 重置密码
    let result = PostFromData('/crm/auth/password/reset', params)
    return result
  },
  ValidateUserName (params) {
    // 校验账号是否存在
    let result = Get('/crm/auth/account/valid', params)
    return result
  },
  QueryProtocolVoList (params) {
    // 查询所有协议
    let result = Get('/crm/api/crmProtocol/queryProtocolVoList', params)
    return result
  }
}

export default LoginAjax
