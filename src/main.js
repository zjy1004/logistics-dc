// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import store from './store'
import axios from 'axios'
//  import VueAwesomeSwiper from 'vue-awesome-swiper'
import { baseFn } from './components/BaseFn/BaseFn'
import vFilters from './tools/vFilters'
import Print from '@/plugs/print'
import VueBarcode from '@xkeshi/vue-barcode'

import 'swiper/dist/css/swiper.css'
import '@/style/reset.less'
import '@/style/base.less'
import '../theme/index.css'
import '@/style/index.css'
import '@/style/common-active.css'
import App from './App'
import ZkTable from 'vue-table-with-tree-grid'
import 'babel-polyfill'

Vue.component(ZkTable.name, ZkTable)
// Vue.directive('focus', function (el, option) {
//   let defClass = 'el-input'
//   let defTag = 'input'
//   let value = option.value || true
//   if (typeof value === 'boolean') {
//     value = { cls: defClass, tag: defTag, foc: value }
//   } else {
//     value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
//   }
//   if (el.classList.contains(value.cls) && value.foc) el.getElementsByTagName(value.tag)[0].focus()
// })
Vue.use(ElementUI)
Vue.use(baseFn)
for (let filter in vFilters) {
  Vue.filter(filter, vFilters[filter])
}
Vue.use(Print) // 注册打印
Vue.component('barcode', VueBarcode) // 条形码生成
//  Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
