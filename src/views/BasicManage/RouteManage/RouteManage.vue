<template>
  <div class="route-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="发货分拨中心:" prop="startDc">
                <el-select v-model="form.startDc" placeholder="请选择发货分拨中心" clearable>
                  <el-option
                    v-for="(item, index) in startDcOption"
                    :key="index"
                    :label="item.dcName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="配送分拨中心:" prop="endDc">
                <el-select v-model="form.endDc" placeholder="请选择配送分拨中心" clearable>
                  <el-option
                    v-for="(item, index) in endDcOption"
                    :key="index"
                    :label="item.dcName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="路由状态:" prop="status">
                <el-select v-model="form.status" placeholder="" clearable>
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
            <el-button class="btn-main" @click="add" v-if="saveRoleType !== 30">新建路由</el-button>
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
                prop="lineRouterName"
                label="路由名称">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="startDcName"
                label="发货分拨中心">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="endDcName"
                label="配送分拨中心">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="status"
                label="路由状态">
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
    <v-dialog
      v-if="clickEnable"
      title="提示"
      :width="'486px'"
      mainText="请确定是否禁用？"
      :closeClickModal="false"
      :dialogVisible="clickEnable"
      @click-cancel="clickEnable = false"
      @click-sure="clickSure()"
    />
  </div>
</template>

<script>
import RouteManageAjax from '@/api/BasicManage/RouteManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'RouteManage',
  data () {
    return {
      enablePostData: {},
      clickEnable: false,
      saveRoleType: '',
      clickSearch: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      startDcOption: [],
      endDcOption: [],
      form: {
        startDc: '',
        endDc: '',
        status: ''
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
      this.queryRoleDcList()
      this.queryDcList()
    },
    queryRoleDcList () { // 查询角色下分拨中心list
      BasicCommonAjax.QueryRoleDcList().then(res => {
        if (res.code === 200) {
          this.startDcOption = res.data
        }
      })
    },
    queryDcList () { // 查询全部分拨中心list
      BasicCommonAjax.QueryDcList().then(res => {
        if (res.code === 200) {
          this.endDcOption = res.data
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
      RouteManageAjax.QueryList(queryParam).then(response => {
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
    add () { // 新增路由
      this.$router.push({name: 'CreateRoute', query: { type: 'add' }})
    },
    check (row) { // 查看
      this.$router.push({name: 'CreateRoute', query: { type: 'check', id: row.routerId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'CreateRoute', query: { type: 'edit', id: row.routerId }})
    },
    enable (row) { // 启用禁用
      this.enablePostData = {
        routerId: row.routerId,
        status: row.status === 1 ? 0 : 1
      }
      this.clickEnable = true
    },
    enableAjax (val) {
      RouteManageAjax.UpdateRouteStatus(val).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: `禁用成功！`,
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    clickSure () {
      this.enableAjax(this.enablePostData)
      this.clickEnable = false
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
.route-manage{
  display: flex;
  flex: 1;
}
</style>

<style lang="less">
@import '../../../style/base.less';
.route-manage{
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
