<template>
  <div class="shiftPlan public_card">
    <!-- <h3 class="card_header">班次计划管理</h3> -->
    <div class="card_main">
      <div class="searchBar">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
            <el-form-item label="线路名称:" prop="lineId">
              <el-select v-model="form.lineId" filterable placeholder="全部" clearable>
                <el-option
                  v-for="(item, index) in lineNameOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期:">
              <el-date-picker
                @change="changeDate"
                value-format="yyyy-MM-dd"
                v-model="form.shiftTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="线路类型:" prop="runStatus">
              <el-select v-model="form.lineType" placeholder="请选择线路类型" clearable>
                <el-option
                  v-for="(item, index) in lineTypeOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运行状态:" prop="runStatus">
              <el-select v-model="form.runStatus" placeholder="请选择状态" clearable>
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
          <el-button @click="search" class="btn-main">查询</el-button>
        </div>
      </div>
      <div class="public_list">
        <div class="listHeader">
          <el-button class="btn-main" @click="creatLine" v-if="creatLineBtnShow">增加临时班次</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          stripe
          border>
          <el-table-column
            prop="lineName"
            label="线路名称"
            >
          </el-table-column>
          <el-table-column
            prop="shiftName"
            label="班次"
            >
          </el-table-column>
          <el-table-column
            prop="tcName"
            label="运力"
            >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            >
          </el-table-column>
          <el-table-column
            prop="lineTypeDisplay"
            label="线路类型"
            >
          </el-table-column>
          <el-table-column
            prop="runStatusDisplay"
            label="运行状态"
            >
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a class="edit" :class="{disabledEdit: scope.row.runStatus === 1}" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改</a>
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
    <creat-shift-plan
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :lineNameOptionsArr="lineNameOptions"
      :editObjProps="editObj"
      :addFlagProps="addFlag"
    />
  </div>
</template>

<script>
import creatShiftPlan from './subpage/creatShiftPlan'
import ShiftPlanAjax from '@/api/DispatchManage/ShiftPlanManage'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'shiftPlan',
  data () {
    return {
      clickSearch: false,
      creatLineBtnShow: true,
      status: [{id: 0, name: '未运行'}, {id: 1, name: '已运行'}],
      dialogVisible: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        lineId: '', // 线路名称
        shiftTime: '', // 班次日期
        runStatus: '',
        lineType: ''
      },
      tableData: [],
      lineNameOptions: [], // 线路列表
      editObj: {}, // 修改传子
      addFlag: '', // 新增修改标识
      lineTypeOptions: [
        {id: 10, name: '配送'},
        {id: 20, name: '专线'}
      ]
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate'])
  },
  created () {
    this.form.shiftTime = this.formatCurrentDate()
    this.queryList()
    this.queryLineList()
  },
  methods: {
    changeDate () {
      let nowDate = new Date(this.formatDate(new Date())).getTime()
      let shiftTime = new Date(this.form.shiftTime).getTime()
      if (shiftTime !== nowDate) {
        this.creatLineBtnShow = false
      } else {
        this.creatLineBtnShow = true
      }
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    edit (row) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '修改班次信息'
      this.dialogWidth = '486px'
      this.editObj = row
      this.addFlag = 'edit'
    },
    creatLine () {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '增加临时班次'
      this.dialogWidth = '486px'
      this.addFlag = 'add'
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    clickDialogSure (val, flag) {
      if (flag === 'add') {
        this.insertShiftPlan(val)
      }
      if (flag === 'edit') {
        this.updateShiftPlan(val)
      }
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
    queryLineList () { // 线路列表
      ShiftPlanAjax.QueryLineList().then(res => {
        if (res.code === 200) {
          this.lineNameOptions = res.data
        }
      })
    },
    insertShiftPlan (val) { // 新增列表
      ShiftPlanAjax.InsertShiftPlan(val).then(res => {
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
    updateShiftPlan (val) { // 修改列表
      ShiftPlanAjax.UpdateShiftPlan(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.$notify({
            type: 'success',
            message: '修改成功！'
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
      ShiftPlanAjax.QueryList(queryParam).then(response => {
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
    creatShiftPlan,
    VPagination
  }
}
</script>
<style lang="less">
.shiftPlan {
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
.shiftPlan {
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
