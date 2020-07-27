function convertCurrency (currencyDigits) {
  // Constants:
  // let MAXIMUM_NUMBER = 99999999999.99
  // Predefine the radix characters and currency symbols for output:
  let CN_ZERO = '零'
  let CN_ONE = '壹'
  let CN_TWO = '贰'
  let CN_THREE = '叁'
  let CN_FOUR = '肆'
  let CN_FIVE = '伍'
  let CN_SIX = '陆'
  let CN_SEVEN = '柒'
  let CN_EIGHT = '捌'
  let CN_NINE = '玖'
  let CN_TEN = '拾'
  let CN_HUNDRED = '佰'
  let CN_THOUSAND = '仟'
  let CN_TEN_THOUSAND = '万'
  let CN_HUNDRED_MILLION = '亿'
  // let CN_SYMBOL = '人民币'
  let CN_DOLLAR = '元'
  let CN_TEN_CENT = '角'
  let CN_CENT = '分'
  let CN_INTEGER = '整'
  let CN_MINUS = '负'

  // Variables:
  let integral // Represent integral part of digit number.
  let decimal // Represent decimal part of digit number.
  let outputCharacters // The output result.
  let parts
  let digits, radices, bigRadices, decimals
  let zeroCount
  let i, p, d
  let quotient, modulus

  // Validate input string:
  currencyDigits = currencyDigits.toString()
  if (currencyDigits === '') {
    // alert('Empty input!')
    return ''
  }
  // if (currencyDigits.match(/[^,.\d]/) != null) {
  //   alert('Invalid characters in the input string!')
  //   return ''
  // }
  // if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
  //   alert('Illegal format of digit number!')
  //   return ''
  // }

  // Normalize the format of input digits:
  currencyDigits = currencyDigits.replace(/,/g, '') // Remove comma delimiters
  currencyDigits = currencyDigits.replace(/^0+/, '') // Trim zeros at the beginning.
  // Assert the number is not greater than the maximum number.
  // if (Number(currencyDigits) > MAXIMUM_NUMBER) {
  //   alert('Too large a number to convert!')
  //   return ''
  // }
  // http://www.knowsky.com/ Process the coversion from currency digits to characters
  // Separate integral and decimal parts before processing coversion:
  parts = currencyDigits.split('.')
  if (parts.length > 1) {
    integral = parts[0]
    decimal = parts[1]
    // Cut down redundant decimal digits that are after the second.
    decimal = decimal.substr(0, 2)
  } else {
    integral = parts[0]
    decimal = ''
  }
  // Prepare the characters corresponding to the digits:
  digits = Array.of(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE)
  radices = Array.of('', CN_TEN, CN_HUNDRED, CN_THOUSAND)
  bigRadices = Array.of('', CN_TEN_THOUSAND, CN_HUNDRED_MILLION)
  decimals = Array.of(CN_TEN_CENT, CN_CENT)
  // Start processing:
  outputCharacters = ''
  // Process integral part if it is larger than 0:
  let isMinus = false
  if (Number(integral) > 0) {
    isMinus = false
  } else if (Number(integral) < 0) {
    isMinus = true
    integral = Math.abs(integral).toString()
  }
  if (Number(integral) > 0) {
    zeroCount = 0
    for (i = 0; i < integral.length; i++) {
      p = integral.length - i - 1
      d = integral.substr(i, 1)
      quotient = p / 4
      modulus = p % 4
      if (d === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          outputCharacters += digits[0]
        }
        zeroCount = 0
        outputCharacters += digits[Number(d)] + radices[modulus]
      }
      if (modulus === 0 && zeroCount < 4) {
        outputCharacters += bigRadices[quotient]
      }
    }
    outputCharacters += CN_DOLLAR
  }
  // Process decimal part if there is:
  if (decimal !== '') {
    for (i = 0; i < decimal.length; i++) {
      d = decimal.substr(i, 1)
      if (d !== '0') {
        outputCharacters += digits[Number(d)] + decimals[i]
      }
    }
  }
  // Confirm and return the final output string:
  if (outputCharacters === '') {
    outputCharacters = CN_ZERO + CN_DOLLAR
  }
  if (decimal === '00') {
    outputCharacters += CN_INTEGER
  }
  if (isMinus) {
    outputCharacters = CN_MINUS + outputCharacters
  }
  // outputCharacters = CN_SYMBOL + outputCharacters;
  // outputCharacters = outputCharacters
  return outputCharacters
}
// 自动补齐小数点后两位
let getFloatStr = function (num) {
  num += ''
  num = num.replace(/[^0-9|.|-]/g, '') // 清除字符串中的非数字非.字符
  if (/^0+/.test(num)) { // 清除字符串开头的0
    num = num.replace(/^0+/, '')
  }
  if (!/\./.test(num)) { // 为整数字符串在末尾添加.00
    num += '.00'
  }
  if (/^\./.test(num)) { // 字符以.开头时,在开头添加0
    num = '0' + num
  }
  num += '00' // 在字符串末尾补零
  let isMinus = Number(num) < 0 ? Number(num) < 0 : false
  num = num.match(/\d+\.\d{2}/)[0]
  if (isMinus) {
    num = `-${num}`
  }
  return num
}
// 获取本年本月最后一天
function getLastDay (year, month) {
  let newYear = year // 取当前的年份
  let newMonth = month++ // 取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) { // 如果当前大于12月，则年份转到下一年
    newMonth -= 12 // 月份减
    newYear++ // 年份增
  }
  let newDate = new Date(newYear, newMonth, 1) // 取当年当月中的第一天
  return (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
}
// 自定义组件，点击空白关闭组件
const clickoutside = {
  // 初始化指令
  bind (el, binding, vnode) {
    function documentHandler (e) {
      if (el.contains(e.target)) {
        return false
      }
      if (binding.expression) {
        binding.value(e)
      }
    }
    el.vueClickOutside = documentHandler
    document.addEventListener('click', documentHandler)
  },
  update () {},
  unbind (el, binding) {
    document.removeEventListener('click', el.vueClickOutside)
    delete el.vueClickOutside
  }
}
// 校验数字
function clearNoNum (value) {
  value = value.replace(/[^\d-.]/g, '')
  value = value.replace(/\.{2,}/g, '.')
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  // value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return value
}
// 校验非负数字
function validatePositiveNumber (value) {
  value = value.replace(/[^\d.]/g, '')
  value = value.replace(/\.{2,}/g, '.')
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  // value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return value
}
// JS获取最近n天和最近n天日期
function getDay (day) {
  var today = new Date()
  var targetday = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth (month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
export { convertCurrency, getFloatStr, getLastDay, clickoutside, clearNoNum, validatePositiveNumber, getDay }
