<template>
  <div class="cash-dpt-mge-detail">
    <div class="public_card">
      <h3 class="detail_header">财务管理 / 保证金管理 / <span class="currentDetail"> {{transName || ''}}</span></h3>
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="操作日期:" prop="operateTime">
                <el-date-picker
                  style="width:445px;"
                  v-model="form.operateTime"
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
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button @click="search" class="btn-main">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <!-- <el-button class="btn-main" @click="exportExcel">导出Excel</el-button> -->
            <el-button class="btn-main" @click="add" v-if="creatLineBtnShow">添加记录</el-button>
            <span class="margin-span">保证金余额：￥{{margin}}</span>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              height="100%"
              stripe
              border>
              <el-table-column
                min-width="3%"
                prop="rowNum"
                label="序号"
                >
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="operateTime"
                label="操作时间">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="operatePerson"
                label="操作人">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="operateType"
                label="类目">
                <template slot-scope="scope">
                  <span>{{scope.row.operateType === 1 ? '充值' : '扣减'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="beforeAmount"
                label="操作前余额">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="afterAmount"
                label="操作后余额">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="remark"
                label="备注">
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
    <add-record
      v-if="dialogVisible"
      title='添加保证金信息记录'
      width='486px'
      :marginVal="margin"
      :marginId="form.marginId"
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
    />
  </div>
</template>

<script>
import AddRecord from './subpage/DetailAddDialog'
import CashDptMgeAjax from '@/api/FinanceManage/CashDptMge/CashDptMge'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'CashDptMgeDetail',
  data () {
    return {
      margin: '',
      transName: '',
      clickSearch: false,
      creatLineBtnShow: true,
      dialogVisible: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        marginId: '',
        operateTime: '',
        operateTimeStart: '',
        operateTimeEnd: ''

      },
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate'])
  },
  created () {
    if (this.$route.query) {
      this.form.marginId = this.$route.query.id
      this.transName = this.$route.query.transName
    }
    this.init()
  },
  methods: {
    init () {
      this.queryListDetail()
      this.getMarginById(this.form.marginId)
    },
    // 查询
    search () {
      this.queryListDetail('searchBtn')
    },
    add () {
      this.dialogVisible = !this.dialogVisible
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    clickDialogSure (val, flag) {
      this.insertDetailCash(val)
    },
    dateChange (val) {
      if (!val) {
        this.form.operateTimeStart = ''
        this.form.operateTimeEnd = ''
        this.form.operateTimeEnd = ''
      } else {
        this.form.operateTimeStart = val[0]
        this.form.operateTimeEnd = val[1]
      }
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryListDetail()
      this.getMarginById(this.form.marginId)
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryListDetail()
      this.getMarginById(this.form.marginId)
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      // this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/waybillManage/exportExcelReturnGoodsWaybill'
      // exportParams.waybillIdList = waybillIdList
      this.exportList(exportParams)
    },
    getMarginById (val) { // 新增列表
      CashDptMgeAjax.GetMarginById({marginId: val}).then(res => {
        if (res.code === 200) {
          if (res.data !== '' && res.data !== null) {
            this.margin = res.data.margin
          }
        }
      })
    },
    insertDetailCash (val) { // 新增列表
      CashDptMgeAjax.InsertDetailCash(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.$notify({
            type: 'success',
            message: '添加成功！'
          })
          this.queryListDetail()
          this.getMarginById(this.form.marginId)
        }
      })
    },
    queryListDetail (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      CashDptMgeAjax.QueryListDetail(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    }
  },
  components: {
    AddRecord,
    VPagination
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.cash-dpt-mge-detail{
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
.cash-dpt-mge-detail{
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
    // margin: 20px 40px 20px 40px;
    .search-btn-con {
      margin-top: 15px;
    }
  }
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 30px;
    margin-top: 0px;
    background: #fff;
    .margin-span {
      margin-left: 20px;
      font-size: 14px;
      height: 34px;
      line-height: 34px;
      display: inline-block;
    }
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
