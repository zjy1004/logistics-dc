<template>
  <div class="transport-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="联系人:" prop="name">
                <el-input v-model="form.name" placeholder="请输入联系人" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="组织关系:" prop="scale">
                <el-select v-model="form.scale" placeholder="" clearable>
                  <el-option
                    v-for="(item, index) in scaleOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="add">新建运力</el-button>
            <!-- <el-button @click="disableRow">禁用</el-button> -->
            <el-button class="btn-main" @click="exportExcel">导出Excel</el-button>
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
                min-width="10%"
                prop="userName"
                label="联系人">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="scaleName"
                label="组织关系">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="status"
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.status === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="200px">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改</a>
                  <a class="reset" href="javascript:;" type="text" size="small" @click="reset(scope.row)">重置密码</a>
                  <!-- <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.status === 1 ? '启用' : '禁用'}}</a> -->
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
    <v-dialog
      v-if="clickResetPwd"
      title="提示"
      :width="'486px'"
      mainText="您确定要重置密码？"
      :closeClickModal="false"
      :dialogVisible="clickResetPwd"
      @click-cancel="clickResetPwd = false"
      @click-sure="clickSure()"
    />
    <v-dialog
      v-if="resetSuccess"
      title="提示"
      :width="'486px'"
      mainText="密码重置成功，重置后密码为：zc1234"
      :closeClickModal="false"
      :dialogVisible="resetSuccess"
      :showCancel="false"
      @click-cancel="resetSuccess = false"
      @click-sure="resetSuccess = false"
    />
  </div>
</template>

<script>
import TransportManageAjax from '@/api/BasicManage/TransportManage'
// import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'TransportManage',
  data () {
    return {
      tcId: '',
      clickResetPwd: false,
      resetSuccess: false,
      clickSearch: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      scaleOptions: [{id: '', name: '全部'}, {id: 1, name: '个人'}, {id: 2, name: '物流公司'}],
      form: {
        name: '',
        scale: '',
        phone: ''
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
    },
    inputPhone () {
      this.form.phone = this.validateNum(this.form.phone)
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
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      TransportManageAjax.QueryList(queryParam).then(response => {
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
    add () { // 新建运力
      this.$router.push({name: 'CreateTransport', query: { type: 'add' }})
    },
    clickSure () { // 确定重置密码
      this.resetPwdAjax()
      this.clickResetPwd = false
    },
    reset (row) { // 点击重置密码
      this.tcId = row.id
      this.clickResetPwd = true
    },
    resetPwdAjax () { // 重置密码请求
      TransportManageAjax.ResetTransPwd({tcId: this.tcId}).then(response => {
        if (response.code === 200) {
          this.resetSuccess = true
        }
      })
    },
    exportExcel () { // 导出excel
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      exportParams.queryParams = this.form
      exportParams.url = '/dc/transport/capacity/exportExcel'
      // exportParams.waybillIdList = waybillIdList
      this.exportList(exportParams)
    },
    check (row) { // 查看
      this.$router.push({name: 'CreateTransport', query: { type: 'check', id: row.id }})
    },
    edit (row) { // 修改
      this.$router.push({name: 'CreateTransport', query: { type: 'edit', id: row.id }})
    }
  },
  components: {
    VPagination,
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.transport-manage{
  display: flex;
  flex: 1;
}
</style>

<style lang="less">
@import '../../../style/base.less';
.transport-manage{
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
