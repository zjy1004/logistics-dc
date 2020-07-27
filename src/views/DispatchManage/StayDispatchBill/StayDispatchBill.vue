<template>
  <div class="stay-dispatch-bill">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="收货方名称:" prop="receiveClientName">
                <el-input v-model="form.receiveClientName" placeholder="请输入收货方名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <!-- <el-button class="btn-main" @click="exportExcel">导出Excel</el-button> -->
            <el-button class="btn-main" @click="batchDispatch">批量调度</el-button>
          </div>
          <div class="table-con">
            <el-table
              class="main-table"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveClientName"
                label="收货方名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receivePhone"
                label="收货方电话">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="receiveAddress"
                label="收货方地址">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                label="操作"
                width="240px">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a href="javascript:;" type="text" size="small" @click="dispatch(scope.row)">调度</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
        </div>
      </div>
    </div>
    <dispatch-dialog
      v-if="lineDialogShow"
      title='线路选择'
      width='480px'
      :dialogVisible="lineDialogShow"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
      :lineOptions="lineList"
      />
  </div>
</template>

<script>
import StayDispatchAjax from '@/api/DispatchManage/StayDispatchWaybill'
import DispatchDialog from './subpage/DispatchDialog'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'StayDispatchBill',
  data () {
    return {
      clickSearch: false,
      lineDialogShow: false,
      dispatchTitle: '',
      lineList: [],
      waybillIdList: [],
      lineId: '',
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        receiveClientName: '',
        waybillNumber: ''
      },
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      this.queryList()
      this.queryLineList()
    },
    queryLineList () { // 线路列表
      StayDispatchAjax.QueryDispatchLine().then(res => {
        if (res.code === 200) {
          this.lineList = res.data
        }
      })
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.queryList('searchBtn')
    },
    queryList (type) {
      let postData = {}
      postData = this.form
      postData.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      postData.pageSize = this.paginationParams.pageSize
      StayDispatchAjax.QueryDispatchWaybillList(postData).then(response => {
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
    check (row) { // 查看
      this.$router.push({name: 'WaybillDetail', query: {waybillTitle: '待调度运单', waybillId: row.waybillId}})
    },
    clickCancel () {
      this.lineDialogShow = false
      this.waybillIdList = []
      this.dispatchTitle = ''
    },
    clickSure (val) {
      this.lineId = val.lineId
      this.dispatchAjax()
    },
    batchDispatch () { // 批量调度
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要调度的行!'
        })
      } else {
        this.waybillIdList = this.multipleSelection.map(item => {
          return item.waybillId
        })
        this.lineDialogShow = true
        this.dispatchTitle = '批量调度成功!'
      }
    },
    dispatch (row) { // 调度
      this.waybillIdList.push(row.waybillId)
      this.dispatchTitle = '调度成功!'
      this.lineDialogShow = true
    },
    dispatchAjax () {
      StayDispatchAjax.Dispatch({waybillIdList: this.waybillIdList, lineId: this.lineId}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: this.dispatchTitle,
            type: 'success'
          })
          this.lineDialogShow = false
          this.waybillIdList = []
          this.dispatchTitle = ''
          this.queryList()
        }
      })
    }
  },
  components: {
    VPagination,
    DispatchDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.stay-dispatch-bill{
  display: flex;
  flex: 1;
}
</style>

<style lang="less">
@import '../../../style/base.less';
.stay-dispatch-bill{
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    .table-con{
      display: flex;
      flex: 1;
    }
  }
  .pagination{
    margin: 10px 0;
    height: 28px;
  }
  .search-btn-con{
    margin-top: 15px!important;
  }
}
</style>
