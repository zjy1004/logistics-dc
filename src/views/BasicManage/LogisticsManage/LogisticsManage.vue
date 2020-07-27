<template>
  <div class="logistics-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="物流公司:" prop="logisticCompany">
                <el-input v-model="form.logisticCompany" placeholder="请输入物流公司名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <!-- <el-form-item label="状态:" prop="status">
                <el-select v-model="form.status" filterable placeholder="请选择状态" clearable>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
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
            <el-button class="btn-main" @click="add">新建物流公司</el-button>
            <!-- <el-button @click="disableRow">禁用</el-button>
            <el-button @click="exportExcel">导出</el-button> -->
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
                prop="logisticsName"
                label="物流公司名称">
              </el-table-column>
              <!-- <el-table-column
                min-width="15%"
                prop="phone"
                label="所在区域">
              </el-table-column> -->
              <el-table-column
                min-width="15%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <!-- <el-table-column
                min-width="10%"
                prop="userStatus"
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.userStatus === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                label="操作"
                width="200px">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <!-- <a class="reset" href="javascript:;" type="text" size="small" @click="resetPassword(scope.row)">重置密码</a> -->
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改</a>
                  <!-- <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.userStatus === 1 ? '启用' : '禁用'}}</a> -->
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
import LogisticsManageAjax from '@/api/BasicManage/LogisticsManage'
// import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'LogisticsManage',
  data () {
    return {
      clickSearch: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        logisticCompany: '',
        phone: ''
      },
      provinceOptions: [],
      cityOptions: [],
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  computed: {
    provinceCode () {
      return this.form.provinceCode
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.cityCode = ''
        this.getAreaList(newVal, 'city')
      }
    }
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
      LogisticsManageAjax.QueryList(queryParam).then(response => {
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
    resetPassword (row) { // 重置密码
      // LoginAjax.ResetPassword({userId: row.userId}).then(response => {
      //   if (response.code === 200) {
      //     this.$notify({
      //       message: '重置密码成功！',
      //       type: 'success'
      //     })
      //   }
      // })
    },
    add () { // 新增物流公司
      this.$router.push({name: 'CreateLogistics', query: { type: 'add' }})
    },
    check (row) { // 查看
      this.$router.push({name: 'CreateLogistics', query: { type: 'check', id: row.logisticsId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'CreateLogistics', query: { type: 'edit', id: row.logisticsId }})
    },
    // disableRow () { // 批量禁用
    //   if (this.multipleSelection < 1) {
    //     this.$notify({
    //       type: 'error',
    //       message: '请您选择要禁用的行!'
    //     })
    //   } else {
    //     let ids = this.multipleSelection.map(item => {
    //       return item.userId
    //     })
    //     this.enable(ids)
    //   }
    // },
    enable (data) { // 启用禁用
      let postData = null
      let editType = ''
      if (Array.isArray(data)) { // 批量禁用
        postData = {
          userIdList: data,
          userStatus: 1
        }
        editType = '批量禁用'
      } else { // 行禁用
        postData = {
          userIdList: [data.userId],
          userStatus: data.userStatus === 1 ? 0 : 1
        }
        editType = data.userStatus === 1 ? '启用' : '禁用'
      }
      LogisticsManageAjax.UpdateLogisticsPersonStatus(postData).then(response => {
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
.logistics-manage{
  display: flex;
  flex: 1;
}
</style>

<style lang="less">
@import '../../../style/base.less';
.logistics-manage{
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
