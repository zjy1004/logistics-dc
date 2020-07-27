// import { Message } from 'element-ui'
import { Notification, Loading } from 'element-ui'
// import CommonAxios from '@/api/Common/CommonAxios'
import Enums from './Enums'
// let message = {}
// message.install = function (Vue, options) {
//   Vue.prototype.$message = function (megOptions) {
//     Message({
//       message: megOptions.message,
//       type: megOptions.type,
//       duration: megOptions.duration || 1500
//     })
//   }
// }
let loadingInstance = null
let baseFn = {}
baseFn.install = function (Vue, options) {
  // loading
  Vue.prototype.printLoading = function (megOptions) {
    loadingInstance = Loading.service({
      text: '正在打印中，请稍后！',
      target: document.querySelector('#app'),
      customClass: 'loadingDefined'
    })
    return loadingInstance
  }
  Vue.prototype.closePrintloading = function () {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  }
  // 全局提示
  Vue.prototype.$notify = function (megOptions) {
    Notification({
      message: megOptions.message,
      type: megOptions.type,
      duration: megOptions.duration || 3000
    })
  }
  // 校验数字（不包含小数点,但包含-）
  Vue.prototype.validateNum = function (megOptions) {
    megOptions = megOptions.replace(/[^\d|-]/g, '')
    return megOptions
  }
  // 校验纯数字（不包含小数点及负号）
  Vue.prototype.validateOnlyNum = function (megOptions) {
    megOptions = megOptions.replace(/[^\d]/g, '')
    return megOptions
  }
  // 校验数字（包含小数点）
  Vue.prototype.validateNumIncludePoint = function (megOptions) {
    megOptions = megOptions.toString().replace(/[^\d.]/g, '')
    return megOptions
  }
  // 校验手机号是否合法
  Vue.prototype.validatePhoneNum = function (megOptions) {
    return (/^1[3456789]\d{9}$/.test(megOptions.toString()))
  }
  // 去除空格
  Vue.prototype.replaceNbsp = function (megOptions) {
    megOptions = megOptions.replace(/\s/g, '')
    return megOptions
  }
  // 身份证号输入过滤
  Vue.prototype.replaceIdNum = function (megOptions) {
    megOptions = megOptions.replace(/[^\d|X|x]/g, '')
    return megOptions
  }
  // 校验身份证号是否合法
  Vue.prototype.validateIdentityCardNum = function (megOptions) {
    let city = {11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 '}
    let tip = ''
    let pass = true
    // 验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
    if (!megOptions || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i.test(megOptions)) {
      tip = '身份证号格式错误'
      pass = false
    } else if (!city[megOptions.substr(0, 2)]) {
      tip = '身份证号地址编码错误'
      pass = false
    } else {
      // 18位身份证需要验证最后一位校验位
      if (megOptions.length === 18) {
        megOptions = megOptions.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
        // 校验位
        let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ]
        let sum = 0
        let ai = 0
        let wi = 0
        for (let i = 0; i < 17; i++) {
          ai = megOptions[i]
          wi = factor[i]
          sum += ai * wi
        }
        let last = parity[sum % 11]
        if (isNaN(Number(megOptions[17]))) { // X | x
          if (!(last === 'X' | last === 'x')) {
            tip = '身份证号校验位错误'
            pass = false
          }
        } else if (last !== Number(megOptions[17])) { // 最后一位是数字
          tip = '身份证号校验位错误'
          pass = false
        }
      }
    }
    return {result: pass, message: tip}
  }
  // 校验手机号是否重复
  // Vue.prototype.validatePhoneEnable = function (megOptions) {
  //   // referenceType 关联类型1物流公司，2物流公司员工，3客户，4内部用户
  //   let {userId, phone, referenceType, callback} = megOptions
  //   CommonAxios.ValidatePhone({userId, phone, referenceType}).then(response => {
  //     if (response.code === 200) {
  //       if (typeof callback === 'function') {
  //         callback(response.data)
  //       } else {
  //         throw new Error('未传入回调函数！')
  //       }
  //     }
  //   })
  //   return megOptions
  // }
  // 校验登录账户输入(只能输入字母+数字)
  Vue.prototype.validateAccount = function (megOptions) {
    megOptions = megOptions.replace(/[^\w]/g, '')
    megOptions = megOptions.replace(/[_]/g, '')
    return megOptions
  }
  // 校验联系人(汉字+英文)
  Vue.prototype.validatePersonName = function (megOptions) {
    megOptions = megOptions.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, '')
    return megOptions
  }
  // 导出
  Vue.prototype.exportList = function (megOptions) {
    let {queryParams, url} = megOptions
    let token = sessionStorage.getItem('token')
    let tmps = []
    for (let key in queryParams) {
      tmps.push(key + '=' + queryParams[key])
    }
    let windowUrl = ''
    if (window.location.hostname === 'localhost') {
      windowUrl = `${process.env.API_BASE_URL}${url}?${tmps.join('&')}&token=${token}`
    } else {
      windowUrl = `${url}?${tmps.join('&')}&token=${token}`
    }
    window.location.href = windowUrl
  }
  // 银行卡加密格式化
  Vue.prototype.fomatBankNum = function (megOptions) {
    if (!megOptions) return
    let result = ''
    let temp = megOptions.length - 7
    let star = ''
    for (let i = 0; i < temp; i++) {
      star += '*'
    }
    result = megOptions.substring(0, 4) + star + megOptions.substring(megOptions.length - 3)
    return result.replace(/(.{4})/g, '$1 ')
  }
  // 校验手机号是否输入合法
  Vue.prototype.isvalidPhone = function (megOptions) {
    return true
    // const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
    // if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(megOptions)) { // 固话
    //   return true
    // } else {
    //   return reg.test(megOptions)
    // }
  }
  // 获取cookie cookieName
  Vue.prototype.getCookie = function (megOptions) {
    let reg = RegExp(megOptions + '=([^;]+)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return arr[1]
    } else {
      return ''
    }
  }
  // 设置cookie cookieObj
  Vue.prototype.setCookie = function (megOptions) {
    let {name, value, day} = megOptions
    let date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date
  }
  // 删除cookie cookieName
  Vue.prototype.delCookie = function (megOptions) {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    document.cookie = megOptions + '=' + null + ';expires=' + date
  }
  // 字符串base64加密解密
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]
  // 加密
  Vue.prototype.base64encode = function (str) {
    var out, i, len
    var c1, c2, c3
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += base64EncodeChars.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
      out += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return out
  }
  // 解密
  Vue.prototype.base64decode = function (str) {
    var c1, c2, c3, c4
    var i, len, out
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c1 === -1)
      if (c1 === -1) break
      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c2 === -1)
      if (c2 === -1) break
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 === 61) return out
        c3 = base64DecodeChars[c3]
      }
      while (i < len && c3 === -1)
      if (c3 === -1) break
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 === 61) return out
        c4 = base64DecodeChars[c4]
      }
      while (i < len && c4 === -1)
      if (c4 === -1) break
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  }
  Vue.prototype.validDuringDay = function (createTimeStart, createTimeEnd) {
    let startTime = new Date(createTimeStart).getTime()
    let endTime = new Date(createTimeEnd).getTime()
    let duringTime = Enums.EXPORT_DAY * 24 * 60 * 60 * 1000
    return (endTime - startTime) <= duringTime
  }
  // 获取某天日期
  Vue.prototype.getDateStr = function (megOptions) {
    let dd = new Date()
    dd.setDate(dd.getDate() + megOptions) // 获取AddDayCount天后的日期
    let y = dd.getFullYear()
    let m = (dd.getMonth() + 1).toString().padStart(2, '0') // 获取当前月份的日期
    let d = dd.getDate().toString().padStart(2, '0')
    return y + '-' + m + '-' + d
  }
}
export { baseFn }
