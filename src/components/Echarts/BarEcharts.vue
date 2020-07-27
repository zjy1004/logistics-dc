<template>
  <div class="con" :style="{width:width,height:height}">
    <div v-show="dataArr.length > 0" :style="{width:width,height:height}" :ref="id"></div>
    <div class="noData" v-show="dataArr.length === 0">暂无数据。</div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'BarEcharts',
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
    showZoom () {
      return this.dataArr.length > 7
    },
    zoomEnd () {
      if (this.dataArr.length <= 7) {
        return 100
      } else if (this.dataArr.length <= 30) {
        return 35
      } else {
        return 10
      }
    },
    xAxisData () {
      return this.dataArr.map(item => {
        return item.createTime
      })
    },
    totalSeriesData () {
      return this.dataArr.map(item => {
        return item[this.totalName]
      })
    },
    seriesData () {
      return this.dataArr.map(item => {
        return item[this.onLineName]
      })
    }
  },
  watch: {
    dataArr: {
      handler (newValue, oldValue) {
        this.dataArr = newValue
        this.drawEcharts()
      },
      deep: true
    }
  },
  data () {
    return {}
  },
  mounted () {
    this.$nextTick(() => {
      this.drawEcharts()
    })
  },
  methods: {
    drawEcharts () {
      let myEchart = echarts.init(this.$refs[this.id])
      myEchart.setOption({
        color: ['#4472C4', '#ED7D31'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            let percentage = ''
            if (Number(params[0].value) === 0) {
              percentage = '0.00'
            } else {
              percentage = ((Number(params[1].value) / Number(params[0].value)).toFixed(4) * 100).toFixed(2)
            }
            return params[0].name + '<br/>' + this.legendArr[0] + ' : ' + params[0].value + '<br/>' +
            this.legendArr[1] + ' : ' + params[1].value + '<br/>' + this.legendArr[2] + ' : ' + percentage + '%'
          }
        },
        legend: {
          y: '20',
          data: this.legendArr
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        dataZoom: {
          show: this.showZoom,
          realtime: true,
          start: 0,
          end: this.zoomEnd
        },
        series: [
          {
            name: this.legendArr[0],
            type: 'bar',
            barWidth: this.showZoom ? '' : '40',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            data: this.totalSeriesData
          },
          {
            name: this.legendArr[1],
            type: 'bar',
            barWidth: this.showZoom ? '' : '40',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'inside'
                }
              }
            },
            data: this.seriesData
          },
          {
            name: this.legendArr[2],
            type: 'line',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#A5A5A5',
                label: {
                  color: '#FF7F50',
                  show: true,
                  offset: [18, 0],
                  formatter: (params) => {
                    let percentage = ''
                    if (Number(this.dataArr[params.dataIndex][this.totalName]) === 0) {
                      percentage = '0.00'
                    } else {
                      percentage = ((params.value / this.dataArr[params.dataIndex][this.totalName]).toFixed(4) * 100).toFixed(2)
                    }
                    return `${percentage}%`
                  }
                }
              }
            },
            data: this.seriesData
          }
        ]
      })
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
