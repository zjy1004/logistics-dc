<template>
  <div class="stay-makeCargo-waybill">
    <div class="public_card">
      <!-- <h3 class="card_header">待接收运单</h3> -->
      <div class="card_main">
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
              <el-form-item label="发货分拨中心:">
                <el-select v-model="form.sendDc" placeholder="请选择分拨中心" clearable>
                  <el-option
                    v-for="(item, index) in dcOption"
                    :key="index"
                    :label="item.dcName"
                    :value="item.dcId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="search-btn-con-list">
          <el-button class="btn-main" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="bulkReceipt">批量接货</el-button>
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
                min-width="10%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="sendDcName"
                label="发货分拨中心">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="packageQuantity"
                label="件数">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="waybillStatusDisplay"
                label="运输状态">
              </el-table-column>
              <!-- <el-table-column
                min-width="12%"
                prop="waybillDeliveryType"
                label="配送类型">
                <template slot-scope="scope">
                  <span>{{scope.row.waybillDeliveryType === 3 ? '联营调度运单' : '自营调度运单'}}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="receipt(scope.row)">接货</a>
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
import WaybillManageAjax from '@/api/WaybillManage/WaybillManage'
import VPagination from '@/components/Pagination/Pagination'
// import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'StayMakeCargoWaybill',
  data () {
    return {
      dcOption: [{id: 1, name: '分拨1'}, {id: 2, name: '分拨2'}], // 分拨中心
      form: {
        sendDc: '',
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '' // 开单时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: [],
      sendLogisticsIdOption: []

    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
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
      this.querySendDc()
    },
    querySendDc () { // 查询发货分拨中心
      WaybillManageAjax.QuerySendDcList().then(res => {
        if (res.code === 200) {
          this.dcOption = res.data
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
      WaybillManageAjax.QueryPickWaybillList(queryParam).then(response => {
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
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
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
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      // this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/dc/waybill/query/list/export'
      // exportParams.waybillIdList = waybillIdList
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
    // 行查看
    check (row) {
      this.$router.push({name: 'WaybillDetail', query: {waybillTitle: '待接货运单', waybillId: row.waybillId}})
    },
    bulkReceipt () { // 批量接货
      if (this.selection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要接货的行!'
        })
      } else {
        let obj = {}
        obj.waybillIdList = this.selection.map(item => {
          return item.waybillId
        })
        this.confirmReceipt(obj)
      }
    },
    confirmReceipt (val) { // 接货请求
      WaybillManageAjax.Receive(val).then(response => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '接货成功！'
          })
          this.queryList()
        }
      })
    },
    receipt (row) { // 行确认接货
      this.confirmReceipt({waybillIdList: row.waybillId})
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.stay-makeCargo-waybill{
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
.stay-makeCargo-waybill{
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
      min-height: 160px;
    }
    .pagination{
      margin: 10px 0;
      height: 28px;
    }
  }
}
</style>
