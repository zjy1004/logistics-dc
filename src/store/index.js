import Vue from 'vue'
import 'babel-polyfill'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import actions from './action'
// import getters from './getters'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    // VoucherInput
  },
  state: {
    userInfo: '',
    menuData: [],
    topTabMenuIndex: '1'
  },
  getters: {
    formatDate: state => (date) => {
      var y = new Date(date).getFullYear()
      var m = new Date(date).getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = new Date(date).getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    formatCurrentDate: state => (date) => {
      let currentDate = new Date()
      var y = currentDate.getFullYear()
      var m = currentDate.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = currentDate.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    hasMenuPermission: state => (firstStair, secondStair, query) => {
      let hasPermission = false
      let firstPermission = state.menuData.some(item => {
        return item.url === firstStair
      })
      if (firstPermission) { // 匹配到了一级菜单
        let firstLen = state.menuData.length
        for (let firstI = 0; firstI < firstLen; firstI++) {
          if (state.menuData[firstI].url === firstStair) { // 单次匹配到了一级菜单
            if (!secondStair) { // 未传入二级菜单
              hasPermission = true
              return hasPermission
            } else {
              let secondPermission = state.menuData[firstI].menuVos.some(item => {
                return item.url === secondStair
              })
              if (!secondPermission) { // 未匹配到二级菜单
                hasPermission = false
                return hasPermission
              } else {
                let secondLen = state.menuData[firstI].menuVos.length
                for (let secondI = 0; secondI < secondLen; secondI++) {
                  if (state.menuData[firstI].menuVos[secondI].url === secondStair) {
                    if (!query) { // 无query参数
                      hasPermission = true
                      return hasPermission
                    } else {
                      if (state.menuData[firstI].menuVos[secondI].menuCode === query) {
                        hasPermission = true
                        return hasPermission
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        return hasPermission
      }
    }
  },
  // ...getters,
  ...actions,
  ...mutations,
  plugins: debug ? [createLogger()] : []
})
