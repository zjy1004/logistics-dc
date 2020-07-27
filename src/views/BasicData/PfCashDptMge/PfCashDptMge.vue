<template>
  <div class="pf-cash-dpt-mge public_card">
    <div class="card_main">
      <div class="searchBar">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
            <el-form-item label="运力名称" prop="capacityName">
              <el-input v-model="form.capacityName"  placeholder="请输入运力名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="search-btn-con">
          <el-button @click="search" class="btn-main">查询</el-button>
        </div>
      </div>
      <div class="public_list">
        <div class="listHeader">
          <el-button class="btn-main" @click="add" v-if="creatLineBtnShow">添加记录</el-button>
        </div>
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
            min-width="20%"
            prop="tcCompanyName"
            label="运力名称"
            >
          </el-table-column>
          <el-table-column
            min-width="10%"
            prop="margin"
            label="保证金余额"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看明细</a>
            </template>
          </el-table-column>
        </el-table>
        <v-pagination
        :dom="this.$refs.form"
        :clickSearch="clickSearch"
        :pageSize=paginationParams.pageSize
        :total=paginationParams.total
        :currentPage=paginationParams.pageNum
        :className="'basicParamPagination'"
        @change-page-size="changePageSize"
        @change-page="changePage"
        class="pagination"
      />
      </div>
    </div>
    <add-record
      v-if="dialogVisible"
      title='添加保证金信息记录'
      width='486px'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
    />
  </div>
</template>

<script>
import AddRecord from './subpage/AddRecordDialog'
import CashDptMgeAjax from '@/api/FinanceManage/CashDptMge/CashDptMge'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'PfCashDptMge',
  data () {
    return {
      clickSearch: false,
      creatLineBtnShow: false,
      dialogVisible: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        capacityName: '' // 运力名称
      },
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate'])
  },
  created () {
    this.queryList()
  },
  methods: {
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    add () {
      this.dialogVisible = !this.dialogVisible
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    clickDialogSure (val, flag) {
      this.insertCashRecord(val)
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
    check (row) {
      this.$router.push({name: 'PfCashDptMgeDetail', query: {id: row.marginId, transName: row.tcCompanyName, margin: row.margin}})
    },
    insertCashRecord (val) { // 新增列表
      CashDptMgeAjax.InsertCashRecord(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.$notify({
            type: 'success',
            message: '新增成功！'
          })
          this.queryList()
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
      CashDptMgeAjax.QueryList(queryParam).then(response => {
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
.pf-cash-dpt-mge {
  .el-date-editor {
    width: 168px !important;
}
 .search-btn-con{
  margin-top: 15px !important;
}
.disabledEdit{
  color: #E6E6E6;
  pointer-events: none;
}
.disabledEdit:hover {
  // color: #E6E6E6 !important;
  // text-decoration: none;
}
}
</style>

<style lang="less" scoped>
.pf-cash-dpt-mge {
  display: flex;
  flex: 1;
    .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
  .pagination {
    margin: 10px 0;
  }
  }
}
</style>
