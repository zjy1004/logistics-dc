<template>
  <div class="settle-for-start-dc">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <div class="common-search">
                <el-form-item label="分拨中心名称:" prop="dcId">
                  <el-select v-model.number="form.dcId" placeholder="请选择分拨中心" clearable filterable>
                    <el-option
                      v-for="(item, index) in dcOptions"
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
        <div class="public_list">
          <div class="listHeader">
            <!-- <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button> -->
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              :summary-method="getSummaries"
              :show-summary="sumShow"
              border>
              <el-table-column
                type="selection"
                width="60">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="dcName"
                label="分拨中心名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="amountCount"
                label="总计(元)">
              </el-table-column>
               <el-table-column
                min-width="10%"
                prop="freightCount"
                label="运费(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="goodsCount"
                label="货款(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillCount"
                label="运单总量">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillTransportCount"
                label="运输中运单">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillSigningCount"
                label="签收运单">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillRefusalCount"
                label="拒收运单">
              </el-table-column>
              <el-table-column
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看全部</a>
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
import SettleForStartDcAjax from '@/api/FinanceManage/FincSettle/SettleForStartDc'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'SettleForStartDc',
  data () {
    return {
      sumShow: false,
      dcOptions: [], // 结算对象下拉
      form: {
        dcId: '', // 分拨中心
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
      this.queryDcList()
    },
    queryDcList () { // 查询角色下分拨中心list
      SettleForStartDcAjax.QueryCollectDc().then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
        }
      })
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      SettleForStartDcAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        } else if (index === 1) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 2 || index === 3 || index === 4) {
            sums[index] += ' 元'
          } else {
            sums[index] += ''
          }
        } else {
          sums[index] = ''
        }
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
    // 查看
    check (row) {
      this.$router.push({name: 'SettleForStartDcDetail', query: {id: row.dcId, dcName: row.dcName, createTimeStart: this.form.createTimeStart, createTimeEnd: this.form.createTimeEnd}})
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
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.settle-for-start-dc{
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
.settle-for-start-dc{
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
