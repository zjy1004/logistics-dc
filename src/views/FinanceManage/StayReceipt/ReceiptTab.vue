<template>
  <div class="receipt-tab">
    <div class="top-header">
      <span class="detail_header">财务管理 / 待收款 / <span class="info"> {{payUser || ''}}</span></span>
    </div>
    <div class="top-con">
      <span style="font-size: 14px;font-weight: bold;">收款操作</span><span style="color: red;">（注：当前页面列表为当前可进行收款的运单列表）</span>
      <span style="margin-left: 100px;">交款人：{{payUser || ''}}</span>
      <span style="margin-left: 210px;">待交款总额：{{totalAmount || ''}}（元）</span>
    </div>
    <div class="main-con">
      <div class="left-con common-div">
        <div class="tip">请按需勾选需要收款的运单</div>
        <div class="search-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="70px">
            <el-row>
              <el-col :span="14">
                <el-form-item class="date-item" label="开单时间:" prop="time">
                  <el-date-picker
                    style="width: 360px;"
                    v-model="form.createTime"
                    type="daterange"
                    @change="dateChange"
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=''>
                  <el-input class="inputWidth" v-model="form.waybillNumber" placeholder="运单号" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="search()">搜索</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table-con">
          <el-table
            ref="leftTable"
            :data="leftTableData"
            style="width: 100%"
            height="100%"
            @selection-change="leftSelectionChange"
            stripe
            border>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              min-width="18%"
              prop="receiveName"
              label="收货方名称">
            </el-table-column>
            <el-table-column
              min-width="14%"
              prop="waybillNumber"
              label="运单号">
            </el-table-column>
            <el-table-column
              min-width="20%"
              prop="createTime"
              label="开单时间">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="amount"
              label="应收总额（元）">
            </el-table-column>
            <el-table-column
              min-width="14%"
              prop="goods"
              label="货款（元）">
            </el-table-column>
            <el-table-column
              min-width="12%"
              prop="freight"
              label="运费（元）">
            </el-table-column>
          </el-table>
        </div>
        <v-pagination
          :pageSize=paginationParams.pageSize
          :total=paginationParams.total
          :currentPage=paginationParams.pageNum
          :dom="this.$refs.form"
          :clickSearch="clickSearch"
          @change-page-size="changePageSize"
          @change-page="changePage"
          class="pagination"
        />
      </div>
      <div class="right-con common-div">
        <div class="tip">本次预收款运单明细 <span class="t-info">(注：单次最多确认200条运单)</span></div>
        <div class="head-con">
          <div class="head-left">总计（元）：<span>￥{{rightTotal}}</span></div>
          <!-- <div class="head-left">总计（元）：<span>￥</span></div> -->
          <div class="head-right">
            <el-button class="btn-main" @click="sureReceipt">确认收款</el-button>
          </div>
        </div>
        <div class="table-con">
          <el-table
            ref="rightTable"
            :data="rightTableData"
            style="width: 100%"
            height="100%"
            stripe
            border>
            <el-table-column
              min-width="18%"
              prop="receiveName"
              label="收货方名称">
            </el-table-column>
            <el-table-column
              min-width="14%"
              prop="waybillNumber"
              label="运单号">
            </el-table-column>
            <el-table-column
              min-width="20%"
              prop="createTime"
              label="开单时间">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="amount"
              label="应收总额（元）">
            </el-table-column>
            <el-table-column
              min-width="14%"
              prop="goods"
              label="货款（元）">
            </el-table-column>
            <el-table-column
              min-width="12%"
              prop="freight"
              label="运费（元）">
            </el-table-column>
            <el-table-column
              label="操作"
              width="70">
              <template slot-scope="scope">
                <a class="del" href="javascript:;" type="text" size="small" @click="remove(scope.row)">移除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- <div class="main_bottom">
      <el-button class="btn-common" @click="goBack()">返回</el-button>
    </div> -->
    <receipt-confirm
      v-if="receiptConfirmVisible"
      :dialogVisible="receiptConfirmVisible"
      :receiptAmount="rightTotal"
      :personName="payUser"
      @click-cancel="receiptConfirmVisible = false"
      @click-sure="sure"
    />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import StayReceiptAjax from '@/api/FinanceManage/FincReceipt/StayReceipt'
// import ReceiptFromStaffAjax from '@/api/ReceiptFromStaff/ReceiptFromStaff'
import ReceiptConfirm from '../../FinanceManage/StayReceipt/subpage/ReceiptConfirm'
import { mapGetters } from 'vuex'
export default {
  name: 'ReceiptTab',
  data () {
    return {
      payUser: '',
      form: {
        payUser: '',
        createTime: '',
        createTimeStart: '', // 到账时间起
        createTimeEnd: '', // 到账时间止
        waybillNumber: '' // 运单号
      },
      stationList: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      leftTableData: [],
      leftSelection: [],
      rightTableData: [],
      paginationChange: false,
      receiptConfirmVisible: false
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate']),
    rightTotal () {
      return this.rightTableData.reduce((pre, next, index, array) => {
        return pre + Number(next.amount)
      }, 0).toFixed(2)
    },
    totalAmount () {
      return this.leftTableData.reduce((pre, next, index, array) => {
        return pre + Number(next.amount)
      }, 0).toFixed(2)
    }
  },
  components: {
    VPagination,
    ReceiptConfirm
  },
  created () {
    if (this.$route.query) {
      this.form.payUser = this.$route.query.payUserId
      this.payUser = this.$route.query.payUser
      this.form.createTimeStart = this.$route.query.createTimeStart || ''
      this.form.createTimeEnd = this.$route.query.createTimeEnd || ''
      this.form.createTime = this.form.createTimeStart ? [this.form.createTimeStart, this.form.createTimeEnd] : []
    }
    this.init()
  },
  watch: {
    leftSelection (newVal, oldVal) {
      const res = new Map()
      Array.from([...oldVal, ...this.rightTableData]).forEach(item => {
        res.set(item.collectId, 1)
      })
      let tempArr = [...newVal, ...oldVal, ...this.rightTableData].filter((item) => !res.has(item.collectId) && res.set(item.collectId, 1))
      if (newVal.length > oldVal.length) {
        this.rightTableData = this.rightTableData.concat(tempArr)
      } else {
        if (!this.paginationChange) {
          let diffArr = oldVal.filter(oldItem => newVal.every(newItem => oldItem.collectId !== newItem.collectId))
          this.rightTableData = this.rightTableData.filter(rightItem => diffArr.every(diffItem => rightItem.collectId !== diffItem.collectId))
        }
      }
      this.$nextTick(() => {
        this.paginationChange = false
      })
    },
    rightTableData (newVal, oldVal) {
      if (newVal.length > 200) {
        let newArr = newVal.slice(200)
        let leftTable = this.$refs.leftTable
        if (newArr.length > 0) {
          this.$notify({
            type: 'error',
            message: '单次最多确认200条运单'
          })
        }
        this.leftTableData.forEach(item => {
          newArr.forEach(newItem => {
            if (item.collectId === newItem.collectId) {
              leftTable.toggleRowSelection(item, false)
            }
          })
        })
      }
    }
  },
  methods: {
    init () {
      this.queryList()
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    goBack () {
      this.$router.push({name: 'StayReceipt'})
    },
    // 左侧行选中变化
    leftSelectionChange (val) {
      this.leftSelection = val
    },
    remove (rightRow) {
      let leftTable = this.$refs.leftTable
      let leftNowHasRightDelRow = false
      this.leftTableData.forEach(item => {
        if (item.collectId === rightRow.collectId) {
          leftNowHasRightDelRow = true
          leftTable.toggleRowSelection(item, false)
        }
      })
      if (!leftNowHasRightDelRow) { // 右侧点移除的数据不在当前左侧表格所在分页中
        this.rightTableData = this.rightTableData.filter(item => {
          return item.collectId !== rightRow.collectId
        })
      }
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    dateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.createTime = ''
      } else {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
        this.rightTableData = []
      }
      StayReceiptAjax.ReceiptTab(queryParam).then(res => {
        if (res.code === 200) {
          this.paginationChange = true
          this.leftTableData = res.data.list || []
          this.paginationParams.pageNum = res.data.currentPage
          this.paginationParams.total = res.data.total
          if (res.data.total === 0) {
            this.rightTableData = []
          }
          this.diffTable(res.data.total)
        }
      })
    },
    // diffTable () {
    //   this.$nextTick(() => {
    //     let leftTable = this.$refs.leftTable
    //     this.leftTableData.forEach(leftItem => {
    //       this.rightTableData.forEach(rightItem => {
    //         if (leftItem.collectId === rightItem.collectId) {
    //           setTimeout(() => {
    //             leftTable.toggleRowSelection(leftItem, true)
    //           })
    //         } else {
    //           leftTable.toggleRowSelection(leftItem, false)
    //         }
    //       })
    //     })
    //   })
    // },
    diffTable (total) {
      this.$nextTick(() => {
        let leftTable = this.$refs.leftTable
        if (total === 1) {
          leftTable.toggleRowSelection(this.leftTableData[0], true)
        } else {
          this.leftTableData.forEach(leftItem => {
            this.rightTableData.forEach(rightItem => {
              if (leftItem.collectId === rightItem.collectId) {
                setTimeout(() => {
                  leftTable.toggleRowSelection(leftItem, true)
                })
              } else {
                leftTable.toggleRowSelection(leftItem, false)
              }
            })
          })
        }
      })
    },
    sureReceipt () {
      if (this.rightTotal <= 0) {
        this.$notify({
          type: 'error',
          message: '收款金额需大于0！'
        })
      } else {
        if (this.rightTableData.length <= 200) {
          this.receiptConfirmVisible = true
        } else {
          this.$notify({
            type: 'error',
            message: '单次最多确认200条运单'
          })
        }
      }
    },
    sure () {
      const loading = this.$loading({
        lock: true,
        text: '正在处理，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      let collectIdList = []
      collectIdList = this.rightTableData.map(item => {
        return item.collectId
      })
      StayReceiptAjax.SureReceipt({collectIdList: collectIdList}).then(res => {
        this.receiptConfirmVisible = false
        if (res.code === 200) {
          this.queryList('searchBtn')
          loading.close()
          this.rightTableData = []
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
        } else {
          loading.close()
        }
      })
    }
  }
}
</script>

<style lang="less">
.receipt-tab {
  .search-con {
    .el-form-item__label {
      width: 70px !important;
    }
    .inputWidth {
      .el-input__inner {
        width: 180px ;
        padding-right: 0!important;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../../style/base.less';
.receipt-tab{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 30px 40px 30px;
  .top-header {
    margin-bottom: 20px;
    .detail_header {
      font-size: 14px;
      color: #8A9099;
      font-weight: bold;
      .info {
        font-size: 14px;
        font-weight: bold;
        color: #24282E;
      }
    }
  }
  .top-con{
    span {
      font-size: 14px;
      color: #333;
    }
    height: 40px;
    line-height: 40px;
    background: #fff;
    padding: 0 20px;
  }
  .main-con{
    display: flex;
    flex: 1;
    flex-direction: row;
    background: #fff;
    .common-div{
      flex-direction: column;
      padding: 20px 20px 30px 20px;
      border: 1px solid #E9EDF2;
      .tip{
        height: 14px;
        .mixin-sc(14px;#333);
        line-height: 14px;
      }
      .t-info {
        .mixin-sc(14px;#f00);
        margin-left: 10px;
      }
    }
    .left-con{
      display: flex;
      flex: 1;
      background: #fff;
      margin-right: 10px;
      .search-con{
        margin: 10px 0;
        height: 60px;
      }
      .table-con{
        display: flex;
        flex: 1;
      }
      .pagination{
        margin: 10px 0;
        height: 28px;
      }
    }
    .right-con{
      display: flex;
      flex: 1;
      background: #fff;
      .head-con{
        height: 40px;
        margin: 20px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .head-left{
          span{
            .mixin-sc(24px;#24282E);
          }
        }
      }
      .table-con{
        display: flex;
        flex: 1;
      }
    }
  }
  .main_bottom {
    .btn-main {
      float: right;
      margin-top: 10px;
    }
  }
}
</style>
