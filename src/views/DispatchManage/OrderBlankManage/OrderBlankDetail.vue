<template>
  <div class="order-blank-detail">
    <div class="public_card">
      <h3 class="detail_header">配货单管理 / <span class="currentDetail">待发货单详情</span></h3>
      <div class="card_main">
        <div class="card_con">
          <div class="table-con">
            <el-table
              id="out-table"
              class="print-table"
              :data="tableData"
              stripe
              height="100%"
              border>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="13%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="goods"
                label="代收货款">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="freight"
                label="运费">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="receivable"
                label="运力应收">
              </el-table-column>
            </el-table>
          </div>
          <!-- <print-picking
            ref="print"
            :hasHeader="true"
            :headerInfo="printHeaderInfo"
            :tableData="printTableData"
          /> -->
        </div>
        <div class="card_btn">
          <div class="search-btn-con">
            <el-button class="btn-main" @click="print">打印配货单</el-button>
            <el-button class="btn-common" @click="goback">返回</el-button>
          </div>
        </div>
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
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      :className="'param'"
      mainText="是否确认打印？"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
  </div>
</template>

<script>
// import PrintPickingAjax from '@/api/PrintPickingBill/PrintPickingBill'
import OrderBlankAjax from '@/api/DispatchManage/OrderBlankManage'
import VDialog from '@/components/Dialog/Dialog'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'DropShippingDetail',
  data () {
    return {
      shiftRunId: '',
      runStatus: '',
      printHeaderInfo: {
        currentDate: '', // 日期
        currentTime: '', // 打印时间
        tcName: '', // 运力
        phone: '', // 运力电话
        lineName: '', // 线路名称
        departureTime: '' // 发车时间，班次时间
      },
      dialogVisible: false,
      tableData: [],
      printTableData: []
    }
  },
  created () {
    let query = this.$route.query
    if (query) {
      this.shiftRunId = query.shiftRunId
    } else {
      this.runStatus = ''
      this.shiftRunId = ''
    }
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList () {
      OrderBlankAjax.QueryDeliveryInfo({shiftRunId: this.shiftRunId}).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
        }
      })
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
    print () {
      this.getPrintInfo(this.shiftRunId)
    },
    clickSure () {
      // this.dialogVisible = false
      // let curDate = new Date()
      // this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
      // this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes()}`
      // this.$nextTick(() => {
      //   this.$print(this.$refs.print)
      // })
    },
    clickCancel () {
      // this.dialogVisible = false
    },
    goback () {
      this.$router.push({name: 'OrderBlankManage'})
    },
    download () {
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.order-blank-detail{
  .table-print-con{
    display: none;
  }
  .public_card {
    .card_main {
      .card_con {
        display: flex;
        .table-con{
          display: flex;
          flex: 1;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.order-blank-detail{
  display: flex;
  flex: 1;
  .public_list{
    display: flex;
    flex-direction: column;
    .btns{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 32px;
      margin-top: 10px;
    }
    .table-print-con{
      -width: 595px;
      margin: 0 auto;
      .print-table{
        -width: 550px;
        margin: 0 auto;
        border-collapse:collapse;
        td{
          border: 1px solid #aaa;
        }
        .articleNumber{
          width: 100px;
        }
        .waybillNumber{
          width: 150px;
        }
        .receiveClient{
          width: 150px;
        }
        .receivePhone{
          width: 100px;
        }
        .receivableGoods{
          width: 80px;
        }
        .receivableFreight{
          width: 80px;
        }
        .waybillReceivable{
          width: 80px;
        }
      }
    }
  }
}
</style>
