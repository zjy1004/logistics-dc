<template>
  <div class="print-picking-bill">
    <div class="public_card">
      <!-- <h3 class="card_header">打印配货单</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item class="date" label="日期:" prop="shiftTime">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="form.shiftTime"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="线路:" prop="lineId">
                <el-select v-model="form.lineId" filterable placeholder="请选择线路" clearable>
                  <el-option
                    v-for="(item, index) in lineOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运力:" prop="tcId">
                <el-select v-model="form.tcId" filterable placeholder="请选择运力" clearable>
                  <el-option
                    v-for="(item, index) in tcOptions"
                    :key="index"
                    :label="item.userName"
                    :value="item.transportCapacityId">
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
            <!-- <el-button class="btn-main" :disabled="exportDisabled" @click="exportExcel()">导出配货单</el-button> -->
            <el-button :disabled="exportDisabled" class="btn-main" @click="printReceiveWaybill()">打印收货运单</el-button>
            <el-button :disabled="exportDisabled" class="btn-main" @click="printLogisticsWaybill()">打印物流运单</el-button>
          </div>
          <div class="table-con">
            <el-table
              ref="tableId"
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="shiftTime"
                label="日期">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="lineName"
                label="线路">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="shiftName"
                label="班次">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="tcName"
                label="运力">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillCounts"
                label="待发车单数">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="totalQuantity"
                label="待装车件数">
              </el-table-column>
              <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a class="print" href="javascript:;" type="text" size="small" @click="print(scope.row)">打印配货单</a>
                  <a class="searchRow" href="javascript:;" type="text" size="small" @click="check(scope.row)">查询</a>
                  <a class="searchRow" href="javascript:;" type="text" size="small" v-if="scope.row.runStatus === 0" @click="depart(scope.row)">发车</a>
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
          <!-- <print-picking
            ref="printCon"
            :hasHeader="true"
            :headerInfo="printHeaderInfo"
            :tableData="printTableData"
          /> -->
          <div class="table-print-con" id="printCon" ref="print">
            <div style="width: 1060px; height: 50px;">
              <div style="width: 840px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderRight: none; borderBottom: none; fontSize: 16px; fontWeight: bold;">
                {{printHeaderInfo.articleNumber}} 发货清单
              </div>
              <div style="width: 220px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">
                打印时间: {{printHeaderInfo.currentDate}} {{printHeaderInfo.currentTime}}
              </div>
            </div>
            <div style="width: 1060px; height: 40px;">
              <div style="width: 270px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                线路: {{printHeaderInfo.lineName}}
              </div>
              <div style="width: 280px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                运力: {{printHeaderInfo.tcName}}
              </div>
              <div style="width: 290px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                电话: {{printHeaderInfo.phone}}
              </div>
              <!-- <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                打印时间: {{printHeaderInfo.currentTime}}
              </div> -->
              <div style="width: 220px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;">
                发车时间: {{printHeaderInfo.departureTime}}
              </div>
            </div>
            <div style="width: 1060px; height: 40px;">
              <div style="width: 670px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="client">运单信息</div>
              <div style="width: 280px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="money">运单费用</div>
              <div style="width: 110px; float: left; fontSize: 13px; border-width: 1px; border-color: #aaaaaa; border-style: solid; height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;" class="other"></div>
            </div>
            <div>
              <table class="print-table" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="width:40px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">序号</th>
                    <th style="width:110px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">运单号</th>
                    <th style="width:130px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">收货方</th>
                    <th style="width:100px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">联系电话(收)</th>
                    <th style="width:160px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">收货地址</th>
                    <th style="width:130px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">发货方</th><!-- 运单号变为发货方 -->
                    <th style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">代收货款</th>
                    <th style="width:100px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">运费</th>
                    <th style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">应收</th>
                    <th style="width:110px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; textAlign: center; borderTop: none;">备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="index" v-for="(tr, index) in printTableData">
                    <td style="width:40px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{ index === (printTableData.length - 1) ? '' : index + 1}}
                    </td>
                    <td style="width:110px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center; word-wrap:break-word;word-break:break-all; ">
                      {{tr.waybillNumber}}
                    </td><!-- 运单号 -->
                    <td style="width:130px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveName}}
                    </td><!-- 收货方 -->
                    <td style="width:100px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.phone}}
                    </td><!-- 联系电话 -->
                    <td style="width:160px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveAddress}}
                    </td><!-- 收货地址 -->
                    <td style="width:130px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.sendName}}
                    </td><!-- 发货方 -->
                    <td style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.goods}}
                    </td><!-- 代收货款 -->
                    <td style="width:100px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.freightDisplay}}
                    </td><!-- 运费 -->
                    <td style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.receivable}}
                    </td><!-- 应收 -->
                    <td style="width:110px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.remark}}
                    </td><!-- 备注 -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 三联运单与箱单 -->
    <print-way-and-box-bill
      ref="printComponent"
      :batchPrintDate="batchPrintObj"
    />
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      :className="'param'"
      mainText="所选班次单量超过100，请确认打印机纸张是否充足且打印过程中如果需要换纸，请不要关闭电源否则会导致数据丢失?"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
      sureBtn="继续打印"
      cancelBtn="不打了"
    />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
import PrintWayAndBoxBill from '../../WaybillManage/NewWaybill/subpage/printWayBoxBill'
import OrderBlankAjax from '@/api/DispatchManage/OrderBlankManage'
import ShiftPlanAjax from '@/api/DispatchManage/ShiftPlanManage'
import { mapGetters } from 'vuex'
export default {
  name: 'PrintPickingBill',
  data () {
    return {
      dialogVisible: false,
      clickSearch: false,
      form: {
        lineId: '',
        tcId: '',
        shiftTime: ''
      },
      selection: [],
      row: null,
      lineOptions: [],
      tcOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      tableData: [],
      printTableData: [],
      printHeaderInfo: {
        currentDate: '', // 日期
        currentTime: '', // 打印时间
        tcName: '', // 运力
        phone: '', // 运力电话
        lineName: '', // 线路名称
        departureTime: '' // 发车时间，班次时间
      },
      batchPrintObj: {
        printArr: [],
        printType: ''
      },
      printDateNum: 0
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    exportDisabled () {
      return this.selection.length === 0
    }
  },
  created () {
    this.form.shiftTime = this.formatCurrentDate()
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
    }
    this.init()
  },
  watch: {
  },
  methods: {
    init () {
      this.queryList()
      this.queryLines()
      this.queryTcs()
    },
    getPrintInfo (val) {
      OrderBlankAjax.GetPrintInfo({shiftRunId: val}).then(response => {
        if (response.code === 200) {
          let { data } = response
          this.printHeaderInfo.tcName = data.tcName
          this.printHeaderInfo.phone = data.phone
          this.printHeaderInfo.lineName = data.lineName
          this.printHeaderInfo.departureTime = data.departureTime
          let curDate = new Date()
          this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
          this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes()}`
          this.printTableData = data.deliveryDetailVos
          let sumGoods = 0 // 代收货款合计
          let sumFreight = 0 // 运费合计
          let sumReceivable = 0 // 应收合计
          this.printTableData.forEach(item => {
            sumGoods += Number(item.goods)
            // sumFreight += Number.isNaN(Number(item.receivableFreightDisplay)) ? 0 : Number(item.receivableFreightDisplay)
            sumFreight += Number(item.freight)
            sumReceivable += Number(item.receivable)
          })
          this.printTableData.map(item => {
            item.waybillNumber = item.waybillNumber.toString()
            return item
          })
          let sumObj = {
            waybillNumber: '合计',
            goods: sumGoods.toFixed(2),
            freightDisplay: sumFreight.toFixed(2),
            receivable: sumReceivable.toFixed(2)
          }
          this.printTableData.push(sumObj)
          this.$nextTick(() => {
            this.$print(this.$refs.print)
          })
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
      OrderBlankAjax.QueryList(queryParam).then(response => {
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
    queryLines () {
      ShiftPlanAjax.QueryLineList().then(res => {
        if (res.code === 200) {
          this.lineOptions = res.data
        }
      })
    },
    queryTcs () {
      ShiftPlanAjax.QueryTranspList().then(res => {
        if (res.code === 200) {
          this.tcOptions = res.data
        }
      })
    },
    search () {
      this.queryList('searchBtn')
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    print (row) {
      this.getPrintInfo(row.shiftRunId)
    },
    check (row) {
      this.$router.push({name: 'OrderBlankDetail', query: { shiftRunId: row.shiftRunId }})
    },
    // 行发车
    depart (row) {
      if (row.runStatus === 0) { // 没发车
        OrderBlankAjax.Departure({shiftRunId: row.shiftRunId}).then(response => {
          if (response.code === 200) {
            this.$notify({
              type: 'success',
              message: '发车成功！'
            })
            this.queryList()
          }
        })
      }
    },
    // 行选中变化
    selectionChange (val) {
      this.selection = val
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let shiftRunIdList = this.selection.map(item => {
        return item.id
      }).join(',')
      let obj = {}
      obj.shiftRunIdList = shiftRunIdList
      exportParams.queryParams = obj
      // this.form.shiftRunIdList = shiftRunIdList
      // exportParams.queryParams = this.form
      exportParams.url = '/waybill/export/exportMapDeliveryList'
      this.exportList(exportParams)
    },
    queryPrintWaybillData (val, flag) {
      OrderBlankAjax.BatchPrintWaybill(val).then((response) => {
        if (response.code === 200) {
          let { data } = response
          this.batchPrintObj.printArr = data
          this.batchPrintObj.printType = flag
          this.printDateNum = data.length
          this.selection = []
          this.$refs.tableId.clearSelection()
          setTimeout(() => {
            this.$refs.printComponent.batchPrint()
          }, 10)
          // if (data.length < 100) {
          //   this.$refs.printComponent.batchPrint()
          // } else {
          //   this.dialogVisible = true
          // }
        }
      })
    },
    // 打印收货运单
    printReceiveWaybill () {
      this.dialogFlag = '收方'
      let arrList = this.selection.map(item => {
        return item.shiftRunId
      })
      this.queryPrintWaybillData({boxes: arrList}, '收方')
    },
    // 打印物流运单
    printLogisticsWaybill () {
      this.dialogFlag = '物流公司回执'
      let arrList = this.selection.map(item => {
        return item.shiftRunId
      })
      this.queryPrintWaybillData({boxes: arrList}, '物流公司回执')
    },
    clickSure () {
      this.dialogVisible = false
      this.$refs.printComponent.batchPrint()
    },
    clickCancel () {
      this.dialogVisible = false
    }
  },
  components: {
    VPagination,
    VDialog,
    PrintWayAndBoxBill
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.print-picking-bill{
  .pagination{
    margin-top: 10px;
  }
  .date{
    .el-date-editor.el-input{
      width: 168px!important;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.print-picking-bill{
  display: flex;
  flex: 1;
  .search-btn-con{
    margin-top: 15px!important;
  }
  .public_list{
    display: flex;
    flex-direction: column;
  }
  .table-con{
    display: flex;
    flex: 1;
  }
  .pagination{
    margin-top: 10px;
  }
  .table-print-con{
    display: none;
  }
}
</style>
