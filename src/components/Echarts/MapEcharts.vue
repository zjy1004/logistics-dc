<template>
  <div class="con" :style="{width:width,height:height}">
    <div :style="{width:width,height:height}" :ref="id"></div>
    <!-- <div class="noData" v-show="dataArr.length === 0">暂无数据。</div> -->
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
export default {
  name: 'MapEcharts',
  props: {
    id: {
      type: String,
      default: 'echarts'
    },
    width: {
      type: String,
      default: '90%'
    },
    height: {
      type: String,
      default: '90%'
    },
    onLineName: {
      type: String,
      default: ''
    },
    totalName: {
      type: String,
      default: ''
    },
    dataArr: {
      type: Array,
      default: () => []
    },
    legendArr: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // showZoom () {
    //   return this.dataArr.length > 7
    // },
    // zoomEnd () {
    //   if (this.dataArr.length <= 7) {
    //     return 100
    //   } else if (this.dataArr.length <= 30) {
    //     return 35
    //   } else {
    //     return 10
    //   }
    // },
    // xAxisData () {
    //   return this.dataArr.map(item => {
    //     return item.createTime
    //   })
    // },
    // totalSeriesData () {
    //   return this.dataArr.map(item => {
    //     return item[this.totalName]
    //   })
    // },
    // seriesData () {
    //   return this.dataArr.map(item => {
    //     return item[this.onLineName]
    //   })
    // }
  },
  watch: {
    // dataArr: {
    //   handler (newValue, oldValue) {
    //     this.dataArr = newValue
    //     this.drawEcharts()
    //   },
    //   deep: true
    // }
  },
  data () {
    return {
      option: {
        title: {
          show: false,
          text: '客户全国分布',
          subtext: '数据来自中驰物联'
        },
        tooltip: {
          trigger: 'item',
          borderColor: function (val) {
          },
          // formatter: '{b}<br/> 现有{c}家（更多业务扩展中）'
          formatter: function (data) {
            return data.name + '<br />' + '现有' + data.value + '家' + '（更多业务扩展中）'
          }
        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 1000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#d8e4fe', '#afd4fe', '#749fed']
          }
        },
        series: [
          {
            name: '中国人口密度',
            type: 'map',
            mapType: 'china', // 自定义扩展图表类型
            roam: false,
            aspectScale: 0.8,
            label: {
              show: true
              // color: 'auto'
            },
            itemStyle: {
              opacity: 0.8
            },
            emphasis: {
              label: {
                color: 'red'
              },
              itemStyle: {
                areaColor: '#C2EE11'
              }
            },
            zoom: 1.2,
            data: [
              {name: '北京', value: Math.round(Math.random() * 1000)},
              {name: '天津', value: Math.round(Math.random() * 1000)},
              {name: '上海', value: Math.round(Math.random() * 1000)},
              {name: '重庆', value: Math.round(Math.random() * 1000)},
              {name: '河北', value: Math.round(Math.random() * 1000)},
              {name: '河南', value: Math.round(Math.random() * 1000)},
              {name: '云南', value: Math.round(Math.random() * 1000)},
              {name: '辽宁', value: Math.round(Math.random() * 1000)},
              {name: '黑龙江', value: Math.round(Math.random() * 1000)},
              {name: '湖南', value: Math.round(Math.random() * 1000)},
              {name: '安徽', value: Math.round(Math.random() * 1000)},
              {name: '山东', value: Math.round(Math.random() * 1000)},
              {name: '新疆', value: Math.round(Math.random() * 1000)},
              {name: '江苏', value: Math.round(Math.random() * 1000)},
              {name: '浙江', value: Math.round(Math.random() * 1000)},
              {name: '江西', value: Math.round(Math.random() * 1000)},
              {name: '湖北', value: Math.round(Math.random() * 1000)},
              {name: '广西', value: Math.round(Math.random() * 1000)},
              {name: '甘肃', value: Math.round(Math.random() * 1000)},
              {name: '山西', value: Math.round(Math.random() * 1000)},
              {name: '内蒙古', value: Math.round(Math.random() * 1000)},
              {name: '陕西', value: Math.round(Math.random() * 1000)},
              {name: '吉林', value: Math.round(Math.random() * 1000)},
              {name: '福建', value: Math.round(Math.random() * 1000)},
              {name: '贵州', value: Math.round(Math.random() * 1000)},
              {name: '广东', value: Math.round(Math.random() * 1000)},
              {name: '青海', value: Math.round(Math.random() * 1000)},
              {name: '西藏', value: Math.round(Math.random() * 1000)},
              {name: '四川', value: Math.round(Math.random() * 1000)},
              {name: '宁夏', value: Math.round(Math.random() * 1000)},
              {name: '海南', value: Math.round(Math.random() * 1000)},
              {name: '台湾', value: Math.round(Math.random() * 1000)},
              {name: '香港', value: Math.round(Math.random() * 1000)},
              {name: '澳门', value: Math.round(Math.random() * 1000)},
              {name: '南海诸岛', value: Math.round(Math.random() * 1000)}
            ],
            // 自定义名称映射
            nameMap: {
              'China': '中国'
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawEcharts()
    })
  },
  methods: {
    drawEcharts () {
      let myEchart = echarts.init(this.$refs[this.id])
      myEchart.setOption(this.option)
    }
  }
}
</script>
<style lang="less">
@import '../../style/base.less';
.con{
  display: flex;
  flex: 1;
  height: 100%;
  .noData{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .mixin-sc(16px;#333);
  }
}
</style>
