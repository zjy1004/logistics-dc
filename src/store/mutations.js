const mutations = {
  // 设置用户信息
  setUserInfo (state, options) {
    let { userInfo } = options
    state.userInfo = userInfo
  },
  // 设置菜单数据
  setMenuData (state, options) {
    let { menuData } = options
    state.menuData = menuData
  },
  // 顶部菜单切换左侧导航改变
  updateTopTabMenuIndex (state, options) {
    let { index } = options
    state.topTabMenuIndex = index
  }
}

export default {
  mutations
}
