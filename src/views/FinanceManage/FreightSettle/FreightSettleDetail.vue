<template>
  <div class="freight-settle-detail">
    <div class="public_card">
      <h3 class="detail_header">财务管理 / 运费结算 / <span class="currentDetail"> {{userName || ''}}</span></h3>
      <div class="card_main">
        <div class="count-info">
          <el-form :inline="true" ref="form" :model="form" label-width="100px">
            <el-form-item label="总计:" prop="">
            </el-form-item>
            <el-form-item label="运输趟数：" prop="">
              {{shiftRunCount}}趟
            </el-form-item>
            <el-form-item label="运输单数：" prop="">
              {{waybillCount}}单
            </el-form-item>
              <el-form-item label="运输件数：" prop="">
                {{waybillQuantity}}件
            </el-form-item>
          </el-form>
        </div>
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
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
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>
              <el-form-item label="结算状态" prop="settleStatus">
                <el-radio-group v-model="form.settleStatus">
                  <el-radio :label="1">待结算</el-radio>
                  <el-radio :label="2">已结算</el-radio>
                </el-radio-group>
              </el-form-item>
               <el-form-item label="接货日期:" prop="updateTime">
                <el-date-picker
                  style="width: 445px;"
                  v-model="form.updateTime"
                  type="daterange"
                  @change="updateChange"
                  clearable
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <!-- <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button> -->
            <el-button class="btn-main" :disabled="settleDisabled" @click="batchSettle">批量确认结算</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
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
                min-width="10%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="updateTime"
                label="接货日期">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="freight"
                label="运费">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="packageQuantity"
                label="件数">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="settleStatusDisplay"
                label="结算状态">
              </el-table-column>
              <el-table-column
                label="操作"
                width="160">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a v-if="scope.row.settleStatus === 1" class="edit" href="javascript:;" type="text" size="small" @click="rowSettle(scope.row)">确认结算</a>
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
import FreightSettletAjax from '@/api/FinanceManage/FincSettle/FreightSettle'
import VPagination from '@/components/Pagination/Pagination'
import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'FreightSettleDetail',
  data () {
    return {
      settleDisabled: false,
      settleBtnShow: true,
      userName: '',
      waybillCount: '',
      waybillQuantity: '',
      shiftRunCount: '',
      form: {
        id: '',
        userType: '',
        settleStatus: 1,
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '', // 开单时间
        updateTimeStart: '',
        updateTimeEnd: '',
        updateTime: '',
        waybillNumber: '' // 运单号
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    settleStatus () {
      return this.form.settleStatus
    }
  },
  watch: {
    settleStatus (newVal, oldVal) {
      if (newVal === 1) {
        this.settleBtnShow = true
      } else {
        this.settleBtnShow = false
      }
    }
  },
  components: {
    VPagination,
    SearchByName
  },
  created () {
    if (this.$route.query) {
      this.form.id = this.$route.query.id
      this.form.userType = this.$route.query.userType
      this.userName = this.$route.query.userName
      this.waybillCount = this.$route.query.waybillCount
      this.waybillQuantity = this.$route.query.waybillQuantity
      this.shiftRunCount = this.$route.query.shiftRunCount
      this.form.createTimeStart = this.$route.query.createTimeStart || ''
      this.form.createTimeEnd = this.$route.query.createTimeEnd || ''
      this.form.createTime = this.form.createTimeStart ? [this.form.createTimeStart, this.form.createTimeEnd] : []
    }
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      FreightSettletAjax.QueryListDetail(queryParam).then(response => {
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
    updateChange (val) {
      if (!val) {
        this.form.updateTimeStart = ''
        this.form.updateTimeEnd = ''
        this.form.updateTime = ''
      } else {
        this.form.updateTimeStart = val[0]
        this.form.updateTimeEnd = val[1]
      }
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/exportMonth'
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
    // 批量确认结算
    batchSettle () {
      this.settleDisabled = true
      if (this.selection.length > 0) {
        let isUnSettle = this.selection.every(item => {
          return item.settleStatus === 1
        })
        if (isUnSettle) {
          let propsList = this.selection.map(item => {
            return item.settleId
          })
          this.settleAjax(propsList)
        } else {
          this.$notify({
            type: 'error',
            message: '勾选行中存在已结算运单！'
          })
          this.settleDisabled = false
        }
      } else {
        this.$notify({
          type: 'error',
          message: '请勾选结算行！'
        })
        this.settleDisabled = false
      }
    },
    // 行确认结算
    rowSettle (row) {
      let propsList = []
      propsList.push(row.settleId)
      this.settleAjax(propsList)
    },
    // 确认结算请求
    settleAjax (val) {
      FreightSettletAjax.SureSettle({settleIdList: val}).then(response => {
        if (response.code === 200) {
          this.settleDisabled = false
          this.$notify({
            type: 'success',
            message: '结算成功！'
          })
          this.queryList()
        } else {
          this.settleDisabled = false
        }
      })
    },
    // 行查看
    check (row) {
      this.$router.push({name: 'FicWbillDetail', query: {waybillId: row.waybillId, id: this.form.id, userType: this.form.userType, waybillTitle: '运费结算', waybillCount: this.waybillCount, waybillQuantity: this.waybillQuantity, shiftRunCount: this.shiftRunCount, userName: this.userName, createTimeStart: this.form.createTimeStart, createTimeEnd: this.form.createTimeEnd}})
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.freight-settle-detail{
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
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.freight-settle-detail{
  display: flex;
  flex: 1;
  flex-direction: column;
  .public_card .main-top{
    span {
      font-size: 14px;
      color: #333;
    }
    .detail_header {
      font-size: 16px;
      color: #666;
      font-weight: bold;
      .info {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
    height: 40px;
    line-height: 40px;
  }
  .public_card .searchBar {
    margin: 0px 30px 10px 30px;
    .search-btn-con {
      margin-top: 15px;
    }
  }
  .card_main .count-info {
  }
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
}
</style>
