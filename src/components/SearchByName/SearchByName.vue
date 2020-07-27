<template>
  <el-autocomplete
    class="inline-input"
    value-key="clientName"
    v-model="form.searchName"
    :fetch-suggestions="querySearch"
    :placeholder="placeholderText"
    :clearable="clearable"
  ></el-autocomplete>
</template>

<script>
import WaybillAjax from '@/api/WaybillManage/WaybillManage'
export default {
  name: 'SearchByName',
  props: {
    searchType: {
      type: String, // 区分搜索类型，收货方(receive)、发货方(send)、全部(all)
      default: 'receive'
    },
    placeholderText: {
      type: String,
      default: '请输入收货方名称'
    }
  },
  data () {
    return {
      clearable: true,
      receiveSourceData: [], // 收货方
      sendSourceData: [], // 发货方
      form: {
        searchName: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryAllList()
    },
    queryAllList () {
      WaybillAjax.GetClientData().then(response => {
        if (response.code === 200) {
          this.receiveSourceData = response.data['1']
          this.sendSourceData = response.data['2']
        }
      })
    },
    querySearch (queryString, callback) {
      let restaurants = ''
      if (this.searchType === 'receive') { // 收货方、修理厂
        restaurants = this.receiveSourceData
      } else if (this.searchType === 'send') { // 发货方、经销商
        restaurants = this.sendSourceData
      } else if (this.searchType === 'all') { // 全部
        let temp = [...this.receiveSourceData, ...this.sendSourceData]
        let hash = {}
        let result = temp.reduce((item, next) => {
          if (!hash[next.id]) {
            hash[next.id] = true
            item.push(next)
          }
          return item
        }, [])
        restaurants = result
      }
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      callback(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.clientName.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || (restaurant.clientNamePinYin !== undefined && restaurant.clientNamePinYin.includes(queryString)))
      }
    }
  }
}
</script>
