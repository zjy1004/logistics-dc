<template>
  <div class="dc-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="110px">
              <el-form-item v-if="saveRoleType !== 20" label="运营公司:" prop="operationName">
                <el-input v-model="form.operationName" placeholder="请输入运营公司名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="分拨中心名称:" prop="distributionCenterName">
                <el-input v-model="form.distributionCenterName" placeholder="请输入分拨中心名称" clearable></el-input>
              </el-form-item>
               <!-- <el-form-item label="区域:" prop="provinceCode">
                <el-select v-model="form.provinceCode" placeholder="请选择省" clearable>
                  <el-option
                    v-for="(item, index) in provinceOptions"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item> -->
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="add">新建分拨中心</el-button>
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
                prop="operationName"
                label="运营公司">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="dcName"
                label="分拨中心名称">
              </el-table-column>
              <!-- <el-table-column
                min-width="10%"
                prop="dcName"
                label="分拨中心区域">
              </el-table-column> -->
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
// import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import DcManageAjax from '@/api/BasicManage/DcManage'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'DcManage',
  data () {
    return {
      saveRoleType: '',
      clickSearch: false,
      provinceOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        operationName: '',
        distributionCenterName: ''
      },
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
  mounted () {
  },
  methods: {
    init () {
      this.queryList()
      // this.getAreaList(0, 'province')
    },
    // getAreaList (val, flag) { // 获取区域list
    //   BasicCommonAjax.QueryAreaList({areaParentCode: val}).then(res => {
    //     if (res.code === 200) {
    //       if (flag === 'province') {
    //         this.provinceOptions = res.data
    //       }
    //     }
    //   })
    // },
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
      let postData = {}
      postData = this.form
      postData.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      postData.pageSize = this.paginationParams.pageSize
      DcManageAjax.QueryList(postData).then(response => {
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
    add () { // 新增分拨中心
      this.$router.push({name: 'CreateDc', query: { type: 'add' }})
    },
    exportExcel () { // 导出excel
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      exportParams.queryParams = this.form
      exportParams.url = '/dc/info/exportDcInfoExcel'
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
          return item.dcId
        })
        this.enable(ids)
      }
    },
    check (row) { // 查看
      this.$router.push({name: 'CreateDc', query: { type: 'check', id: row.dcId }})
    },
    edit (row) { // 修改
      this.$router.push({name: 'CreateDc', query: { type: 'edit', id: row.dcId }})
    },
    enable (data) { // 启用禁用
      let postData = null
      let editType = ''
      if (Array.isArray(data)) { // 批量禁用
        postData = {
          dcIdList: data,
          dcStatus: 1
        }
        editType = '批量禁用'
      } else { // 行禁用
        postData = {
          dcIdList: [data.dcId],
          dcStatus: data.status === 1 ? 0 : 1
        }
        editType = data.status === 1 ? '启用' : '禁用'
      }
      DcManageAjax.UpdateDcStatus(postData).then(response => {
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
.dc-manage{
  display: flex;
  flex: 1;
}
</style>

<style lang="less">
@import '../../../style/base.less';
.dc-manage{
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
