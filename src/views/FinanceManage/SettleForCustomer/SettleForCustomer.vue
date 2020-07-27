<template>
  <div class="settle-for-customer">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <div class="common-search">
                <el-form-item label="客户名称:" prop="clientId">
                  <el-select
                    v-model.number="form.clientId"
                    placeholder="请选择客户名称"
                    remote
                    reserve-keyword
                    :remote-method="searchClient"
                    :loading="loading"
                    filterable>
                    <el-option
                      v-for="(item, index) in clientOptions"
                      :key="index"
                      :label="item.displayName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="开单日期:" prop="createTime">
                  <el-date-picker
                    style="width: 445px;"
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
              </div>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <!-- <div class="search-btn-con-list">
          <el-button class="btn-main" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div> -->
        <div class="public_list">
          <div class="listHeader">
            <!-- <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button> -->
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="100%"
              @selection-change="selectionChange"
              :summary-method="getSummaries"
              :show-summary="sumShow"
              border>
              <el-table-column
                type="selection"
                width="60">
              </el-table-column>
              <el-table-column
                min-width="3%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="clientName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillCount"
                label="总单量">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="waybillAmount"
                label="未结算货款(元)"
                >
              </el-table-column>
              <el-table-column
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <!-- <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a> -->
                  <a class="edit" href="javascript:;" type="text" size="small" @click="receiptAccount(scope.row)">对账结算</a>
                </template>
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
      </div>
    </div>
  </div>
</template>

<script>
import SettleForCustomerAjax from '@/api/FinanceManage/FincSettle/SettleForCustomer'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'SettleForCustomer',
  data () {
    return {
      sumShow: false,
      loading: false,
      clientName: '',
      clientOptions: [], // 客户下拉
      form: {
        clientId: '', // 收款人
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '' // 开单时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    tabLen () {
      return this.tableData.length
    }
  },
  watch: {
    tabLen (newVal, oldVal) {
      if (newVal > 0) {
        this.sumShow = true
      } else {
        this.sumShow = false
      }
    }
  },
  components: {
    VPagination
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
      this.queryList()
      this.getClient(this.clientName)
    },
    getClient (val) { // 查询物流公司下所有员工包括物流公司管理员
      SettleForCustomerAjax.QueryClients({clientName: val}).then(res => {
        if (res.code === 200) {
          this.clientOptions = res.data
          this.loading = false
        }
      })
    },
    searchClient (query) {
      if (query !== '') {
        this.loading = true
        this.getClient(query)
      } else {
        this.getClient(this.clientName)
      }
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      SettleForCustomerAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]))
        if (index === 0) {
          sums[index] = '总计'
          // return
        } else if (index === 3) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else if (index === 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
        // const values = data.map(item => Number(item[column.property]))
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr)
        //     if (!isNaN(value)) {
        //       return prev + curr
        //     } else {
        //       return prev
        //     }
        //   }, 0)
        //   sums[index] += ' 元'
        // } else {
        //   sums[index] = ''
        // }
      })
      return sums
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
    // 行对账结算
    receiptAccount (row) {
      // this.$router.push({name: 'ReceiptFromStaff', query: {userId: row.userId, userName: row.userName}})
      let option = {
        name: 'ForCustomerTab',
        query: {
          clientName: row.clientName,
          clientId: row.clientId,
          createTimeStart: this.form.createTimeStart,
          createTimeEnd: this.form.createTimeEnd
        }
      }
      let routes = this.$router.resolve(option)
      window.open(routes.href, '_blank')
    },
    check (row) {
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let waybillIdList = this.selection.map(item => {
        return item.waybillId
      }).join(',')
      this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/api/employees/exportFinanceCollectionEmployeesList'
      this.exportList(exportParams)
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
    // 行选中变化
    selectionChange (val) {
      this.selection = val
    },
    renderColTip (h, {column, $index}) {
      return (
        <div class="render-col-header">
          <span>{column.label}</span>
          <i class="el-icon-warning">
            <div class="tip-con">总额 = 已收总额 + 未收总额</div>
            <div class="tip-icon"></div>
          </i>
        </div>
      )
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.settle-for-customer{
  .btns{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-select .el-input.is-disabled .el-input__inner{
    height: 32px;
  }
  .render-col-header{
    align-items: center;
    padding: 0px;
    display: flex;
    overflow: visible;
    justify-content: center;
    .el-icon-warning{
      position: relative;
      font-size: 16px;
      text-indent: 0px;
      cursor: pointer;
      color: #747484;
      margin-left: 3px;
      .tip-con{
        display: none;
        position: absolute;
        z-index: 1;
        padding: 3px 5px;
        top: -60px;
        left: -70px;
        width: 170px;
        height: 50px;
        line-height: 15px;
        text-align: left;
        // overflow: hidden;
        background: #333;
        border-radius: 5px;
        color: #fff;
      }
      .tip-icon{
        display: none;
        position: absolute;
        top: -10px;
        left: 5px;
        padding: 0px;
        .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
      }
    }
    .el-icon-warning:hover{
      color: #4689f2;
      .tip-con,.tip-icon{
        display: block;
      }
    }
  }
  .el-table{
    overflow: visible;
    .el-table__header-wrapper, .el-table__footer-wrapper{
      overflow: visible;
    }
    th{
      overflow: visible;
      text-align: center;
      .cell{
        overflow: visible;
      }
      div.tip-con{
        white-space: normal;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.settle-for-customer{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 30px;
    margin-top: 0px;
    background: #fff;
    .btn-con{
      height: 34px;
      margin-top: 20px;
      margin-bottom: 20px;
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
  .search-btn-con{
    margin-top: 15px!important;
  }
}
</style>
