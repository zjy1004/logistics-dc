<template>
  <div class="customer-path-Manage">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="线路名称:" prop="lineName">
                <el-input v-model="form.lineName" placeholder="请输入线路名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="运营公司:" v-if="saveRoleType === 10" prop="operationNameId">
                <el-select v-model="form.operationCompanyId" filterable @change="opCoyChange" placeholder="请选择运营公司" clearable>
                  <el-option
                    v-for="(item, index) in opcoyOptions"
                    :key="index"
                    :label="item.companyAbbreviation"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
          <el-form-item label="分拨中心:" v-if="saveRoleType === 10" prop="dcId">
            <el-select v-model="form.dcId" filterable placeholder="请选择分拨中心" clearable>
              <el-option
                v-for="(item, index) in dcOptions"
                :key="index"
                :label="item.dcName"
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
            <el-button class="btn-main" @click="add">新建线路</el-button>
            <el-button class="btn-main" @click="disableRow">禁用</el-button>
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
                min-width="20%"
                prop="lineName"
                label="线路名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="operationName"
                label="所属运营公司">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="dcName"
                label="所属分拨中心">
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
                  <!-- <a class="reset" href="javascript:;" type="text" size="small" @click="resetPassword(scope.row)">重置密码</a> -->
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改</a>
                  <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.status === 1 ? '启用' : '禁用'}}</a>
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
  </div>
</template>

<script>
import CustomerPathAjax from '@/api/BasicManage/CustomerPathManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import LoginAjax from '@/api/Login/Login'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'CustomerPathManage',
  data () {
    return {
      saveRoleType: '',
      clickSearch: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        lineName: '',
        dcId: '',
        operationCompanyId: ''
      },
      opcoyOptions: [],
      dcOptions: [],
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo) {
      this.saveRoleType = userInfo.accountType
    }
    this.init()
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    init () {
      this.queryList()
      if (this.saveRoleType === 10) {
        this.queryOpCoyList()
      }
    },
    queryOpCoyList () { // 查询运营公司list
      BasicCommonAjax.QueryOpCoyList().then(res => {
        if (res.code === 200) {
          this.opcoyOptions = res.data
        }
      })
    },
    queryRoleDcList (val) { // 查询角色下分拨中心list
      BasicCommonAjax.QueryRoleDcList({operationId: val}).then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
        }
      })
    },
    opCoyChange (val) { // 运营公司变化
      BasicCommonAjax.QueryRoleDcList({operationId: val}).then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
          this.form.dcId = ''
        }
      })
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
      CustomerPathAjax.QueryList(queryParam).then(response => {
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
    exportExcel () { // 导出excel
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      exportParams.queryParams = this.form
      exportParams.url = '/dc/line/exportDistributionLineExcel'
      // exportParams.waybillIdList = waybillIdList
      this.exportList(exportParams)
    },
    disableRow () { // 批量禁用
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要禁用的行!'
        })
      } else {
        let ids = this.multipleSelection.map(item => {
          return item.lineId
        })
        this.enable(ids)
      }
    },
    resetPassword (row) { // 重置密码
      LoginAjax.ResetPassword({userId: row.userId}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '重置密码成功！',
            type: 'success'
          })
        }
      })
    },
    add () { // 新增配送线路
      this.$router.push({name: 'CreateCustomerPath', query: { type: 'add' }})
    },
    check (row) { // 查看
      this.$router.push({name: 'CreateCustomerPath', query: { type: 'check', id: row.lineId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'CreateCustomerPath', query: { type: 'edit', id: row.lineId }})
    },
    enable (data) { // 启用禁用
      let postData = null
      let editType = ''
      if (Array.isArray(data)) { // 批量禁用
        postData = {
          lineIdList: data,
          lineStatus: 1,
          lineType: 10
        }
        editType = '批量禁用'
      } else { // 行禁用
        postData = {
          lineIdList: [data.lineId],
          lineStatus: data.status === 1 ? 0 : 1,
          lineType: 10
        }
        editType = data.status === 1 ? '启用' : '禁用'
      }
      CustomerPathAjax.UpdateDistributionLineStatus(postData).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: `${editType}成功！`,
            type: 'success'
          })
          this.queryList()
        }
      })
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.customer-path-Manage{
  display: flex;
  flex: 1;
}
</style>

<style lang="less">
@import '../../../style/base.less';
.customer-path-Manage{
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
