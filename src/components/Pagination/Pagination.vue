<template>
  <el-row class="pagination-row" :class="classNameDefine">
    <div class="page-total">
      <span>总数{{total}}条</span>
    </div>
    <div class="page-main">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSizeData"
        :current-page="currentPageData"
        :total="total"
        @current-change="currentChange"
        >
      </el-pagination>
    </div>
    <div class="page-size">
      <span class="chooseSize" @click.stop="chooseSize1">
        <span :class="{'active-text':activeText}">每页{{pageSizeData}}条</span>
        <span ref="triangle" class="triangle" :class="{'active-triangle':activeText}">
          <div ref="table" class="table-con" v-show="showChoose" v-clickoutside="handleClose">
            <table class="size-content" @click.stop="clickSize">
              <tr :key="index" v-for="(tr,index) in list">
                <td :class="{'isSelectSize': td.isSelect}" :key="tdIndex" v-for="(td,tdIndex) in tr">{{td.num}}</td>
              </tr>
            </table>
          </div>
        </span>
      </span>
    </div>
  </el-row>
</template>

<script>
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
export default {
  name: 'Pagination',
  props: {
    className: {
      type: String,
      default: ''
    },
    pageSize: {
      type: [Number, String],
      default: 10
    },
    currentPage: {
      type: [Number, String],
      default: 1
    },
    total: {
      type: [Number, String],
      default: 0
    },
    dom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    clickSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      classNameDefine: this.className,
      showChoose: false,
      pageSizeData: this.pageSize,
      currentPageData: this.currentPage,
      activeText: false,
      list: [
        [{num: 5}, {num: 10}, {num: 15}],
        [{num: 20}, {num: 25}, {num: 30}],
        [{num: 35}, {num: 40}, {num: 50}],
        [{num: 100}, {num: 150}, {num: 200}]
      ]
    }
  },
  watch: {
    currentPage (newData, oldData) {
      this.currentPageData = newData
    },
    pageSize (newData, oldData) {
      this.pageSizeData = newData
    },
    clickSearch (newData, oldData) {
      this.clickSearchData = newData
    }
  },
  directives: {clickoutside},
  created () {
    this.filterSelect(this.pageSize)
  },
  methods: {
    handleClose (e) {
      this.showChoose = false
      this.activeText = false
    },
    filterSelect (curSize) {
      this.list.forEach(item => {
        item.forEach(inner => {
          if (inner.num === curSize) {
            inner.isSelect = true
          } else {
            inner.isSelect = false
          }
        })
      })
    },
    chooseSize1 () {
      this.showChoose = !this.showChoose
      this.activeText = !this.activeText
    },
    clickSize (event) {
      let chooseData = parseInt(event.target.innerHTML)
      if (isNaN(chooseData)) return false
      this.pageSizeData = chooseData
      this.showChoose = false
      this.activeText = false
      this.currentPageData = 1
      this.filterSelect(chooseData)
      if (this.dom && !this.clickSearchData && this.clickSearchData !== undefined) {
        this.dom.resetFields()
      }
      this.$emit('change-page-size', chooseData)
    },
    currentChange (event) {
      this.currentPageData = event
      if (this.dom && !this.clickSearchData && this.clickSearchData !== undefined) {
        this.dom.resetFields()
      }
      this.$emit('change-page', this.pageSizeData, event)
    }
  }
}
</script>
<style lang="less">
.pagination-row{
  height: 28px;
  line-height: 28px;
  .page-size{
    float: right;
    cursor: pointer;
    .chooseSize{
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      span{
        font-size: 14px;
      }
      .active-text{
        color: #04B8D7;
      }
      .triangle{
        position: relative;
        display: inline-block;
        margin: 0px 8px 3px 8px;
        width: 10px;
        height: 5px;
        background: url('../../image/icon.png') -386px -226px;
        .table-con{
          width: 94px;
          height: 132px;
          background: url('../../image/icon.png') -382px -248px;
          position: absolute;
          left: -43px;
          top: -143px;
          z-index: 3;
          .size-content{
            width: 94px;
            height: 120px;
            tr:last-child{
              td:nth-child(2){
                border-bottom: none;
              }
            }
            td{
              -webkit-user-select:none;
              -moz-user-select:none;
              -ms-user-select:none;
              user-select:none;
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              border: 1px solid #dddddd;
              background:#fff;
              color:#666666;
            }
            td:hover{
              background:#f3f3f3;
              color:#04B8D7;
            }
            .white-triangle{
              width: 12px;
              height: 6px;
              background-size: 100% 100%;
            }
            .isSelectSize{
              background: #f3f3f3;
              color: #04B8D7;
            }
          }
        }
      }
    }
  }
  .page-main{
    float: right;
  }
  .page-size:hover{
    color: #04B8D7;
    .triangle{
      background: url('../../image/icon.png') -497px -226px;
    }
  }
  .active-triangle{
      background: url('../../image/icon.png') -411px -227px!important;
  }
  .page-total{
    float: right;
    text-indent: 5px;
    span{
      font-size: 14px;
    }
  }
}
</style>
