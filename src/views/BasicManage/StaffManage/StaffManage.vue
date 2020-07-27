<template>
  <div class="dc-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="员工姓名:" prop="userName">
                <!-- <el-input v-model="form.userName" @input="validType(form.userName)" placeholder="请输入员工姓名" clearable></el-input> -->
                <el-input v-model="form.userName" placeholder="请输入员工姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="分拨中心:" prop="dcId">
                <el-select v-model="form.dcId" filterable placeholder="请选择分拨中心" clearable>
                  <el-option
                    v-for="(item, index) in dcOptions"
                    :key="index"
                    :label="item.dcName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-select v-model="form.status" filterable placeholder="请选择状态" clearable>
                  <el-option
                    v-for="(item, index) in status"
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
            <el-button class="btn-main" @click="add">新建员工</el-button>
            <el-button class="btn-main" @click="disableRow">禁用</el-button>
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
                prop="userName"
                label="员工姓名">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="dcName"
                label="分拨中心">
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
                width="240px">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="reset" href="javascript:;" type="text" size="small" @click="reset(scope.row)">重置密码</a>
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
import StaffManageAjax from '@/api/BasicManage/StaffManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'DcManage',
  data () {
    return {
      personnelId: '',
      clickResetPwd: false,
      resetSuccess: false,
      clickSearch: false,
      dcOptions: [
      ],
      provinceOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        userName: '',
        phone: '',
        dcId: '',
        status: ''
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
      this.queryDcList()
    },
    queryDcList () { // 查询分拨中心list
      BasicCommonAjax.QueryDcList().then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
        }
      })
    },
    valid (t) {
      var pattern = /^([\u4E00-\u9FA5])*$/gi
      if (pattern.test(t)) {
        return true
      } else {
        return false
      }
    },
    validType (val) {
      let len = val.length
      let tVal = val.substr(len - 1)
      this.valid(tVal)
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
      StaffManageAjax.QueryList(queryParam).then(response => {
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
      this.$router.push({name: 'CreateStaff', query: { type: 'add' }})
    },
    check (row) { // 查看
      this.$router.push({name: 'CreateStaff', query: { type: 'check', id: row.personnelId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'CreateStaff', query: { type: 'edit', id: row.personnelId }})
    },
    clickSure () { // 确定重置密码
      this.resetPwdAjax()
      this.clickResetPwd = false
    },
    reset (row) { // 点击重置密码
      this.personnelId = row.personnelId
      this.clickResetPwd = true
    },
    resetPwdAjax () { // 重置密码请求
      StaffManageAjax.ResetStaffPwd({personnelId: this.personnelId}).then(response => {
        if (response.code === 200) {
          this.resetSuccess = true
        }
      })
    },
    disableRow () { // 批量禁用
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要禁用的行!'
        })
      } else {
        let ids = this.multipleSelection.map(item => {
          return item.personnelId
        })
        this.enable(ids)
      }
    },
    enable (data) { // 启用禁用
      let postData = null
      let editType = ''
      if (Array.isArray(data)) { // 批量禁用
        postData = {
          personnelIdList: data,
          personnelStatus: 1
        }
        editType = '批量禁用'
      } else { // 行禁用
        postData = {
          personnelIdList: [data.personnelId],
          personnelStatus: data.status === 1 ? 0 : 1
        }
        editType = data.status === 1 ? '启用' : '禁用'
      }
      StaffManageAjax.UpdateStaffStatus(postData).then(response => {
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
    VPagination,
    VDialog
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
