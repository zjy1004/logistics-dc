<template>
  <div class="con" :style="{width:width,height:height}">
    <div :style="{width:width,height:height}" v-show="dataArr.length > 0" :ref="id"></div>
    <div class="noData" v-show="dataArr.length === 0">暂无数据。</div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'PieEcharts',
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
    dataArr: {
      type: Array,
      default: () => []
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    seriesNameData: {
      type: String,
      default: '运单量'
    }
  },
  computed: {
    legendData () {
      return this.dataArr.map(item => {
        return item.name
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
    },
    seriesNameData () {
      this.drawEcharts()
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
        // title: {
        //   text: '饼图纹理',
        //   textStyle: {
        //     color: '#235894'
        //   }
        // },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} <br/>{a} : {c} ({d}%)'
          formatter: function (data) {
            return data.name + '<br />' + data.seriesName + ': ' + data.value + ' (' + data.data.percent + ')'
          }
        },
        // legend: {
        //   type: 'scroll',
        //   orient: 'vertical',
        //   x: 'left',
        //   y: 'top',
        //   data: this.legendData
        // },
        series: [{
          name: this.seriesNameData,
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 10,
          clockwise: true,
          label: {
            normal: {
              textStyle: {
                fontSize: 16,
                color: '#235894'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: '#235894'
              }
            }
          },
          data: this.dataArr,
          itemStyle: {
            normal: {
              label: {
                show: this.showLabel
              },
              color: function (params) {
                let colorList = [
                  '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ]
                if (params.dataIndex <= (colorList.length - 1)) {
                  return colorList[params.dataIndex]
                } else {
                  return colorList[params.dataIndex % (colorList.length - 1)]
                }
              }
            }
          }
        }]
      })
    }
  }
}
</script>
<style lang="less" scope>
@import '../../style/base.less';
.con{
  // width: 100%;
  // height: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  .noData{
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    .mixin-sc(16px;#333);
  }
}
</style>
