<template>
  <div class="PfWaybillDetail public_card">
    <h3 class="detail_header">{{waybillTitle}} / <span class="currentDetail">运单详情</span></h3>
    <div class="card_main">
      <div class="card_con">

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">运单信息</span>
          <span class="w-title">运单号：</span>
          <span class="w-num">{{waybillNumber}}</span>
        </div>
        <div class="transInfo info">
          <div class="tsInfo-item" v-for="(item, index) in waybillInfoList" :key="index">
            <div class="item-left">
              <div class="item-text">{{item.dcName}}</div>
              <div class="item-text">{{item.operatePerson}}</div>
              <div class="item-text">{{item.operateTime}}</div>
            </div>
            <div class="item-right">
              <div class="item-driver">{{item.transportCapacityName}}</div>
              <div v-if="index !== waybillInfoList.length - 1 || (index === waybillInfoList.length - 1 && item.dcName !== null) || waybillInfoList.length === 1" class="item-line"></div>
            </div>
          </div>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">基础信息</span>
        </div>
        <div class="basicInfo info">
          <div class="box">
            <ul class="box_head">
              <li class="box_head_li">收货方</li>
              <li class="box_head_li">发货方</li>
            </ul>
            <div class="box_left">
              <ul class="box_main">
                <li class="box_li"><span>收货方：</span><span>{{this.receiveClientInfo.clientName}}</span></li>
                <li class="box_li"><span>联系电话：</span><span>{{this.receiveClientInfo.clientPhone}}</span></li>
                <li class="box_li"><span>联系地址：</span><span>{{this.receiveClientInfo.clientAddress}}</span></li>
                <li class="box_li"><span>分拨中心：</span><span>{{this.receiveClientInfo.clientDcName}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li class="box_li"><span>发货方：</span><span>{{this.sendClientInfo.clientName}}</span></li>
                <li class="box_li"><span>联系电话：</span><span>{{this.sendClientInfo.clientPhone}}</span></li>
                <li class="box_li"><span>联系地址：</span><span>{{this.sendClientInfo.clientAddress}}</span></li>
                <li class="box_li"><span>分拨中心：</span><span>{{this.sendClientInfo.clientDcName}}</span></li>
              </ul>
            </div>

          </div>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">货品信息</span>
        </div>
        <div class="info">
            <el-table
              :data="packageInfoData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="10%"
                prop="packageName"
                label="货物名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="packageQuantity"
                label="包裹数">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="remark"
                label="备注">
              </el-table-column>
            </el-table>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">收款信息</span>
        </div>
        <div class="info">
            <el-table
              :data="receivablesTableData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="10%"
                prop="feeType"
                label="费用类型">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="feeAmount"
                label="费用(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="collectPerson"
                label="收款人">
              </el-table-column>
            </el-table>
        </div>
        <!-- 财务信息 -->
        <div class="card_form_title" style="margin-top: 30px;">
          <span class="title_line"></span>
          <span class="title">运输信息</span>
        </div>
        <div class="waybillInfo">
          <div class="waybillInfoBox">
            <ul class="box_main">
              <li :key="key" v-for="(item, key) in (this.waybillFinanceOperateList)"><span>{{item.operateTime}}：{{item.operate}}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
          <div v-if="false" class="radio-con">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="checkItem.label" :key="index" v-for="(checkItem,index) in checkGroup">{{checkItem.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="btn-con">
            <el-button v-if="false" class="btn-main" @click="printList()">打印</el-button>
            <el-button class="btn-common" @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 三联运单与箱单 -->
    <!-- <print-way-and-box-bill
      ref="printComponent"
      :waybillId="printWaybillId"
      :checkList="checkList"
    /> -->
  </div>
</template>

<script>
import WaybillAjax from '@/api/WaybillManage/WaybillManage'
// import ENUMS from '@/enums/enums'
// import PrintWayAndBoxBill from '../WaybillManage/subpage/printWayBoxBill'
export default {
  data () {
    return {
      waybillNumber: '',
      printWaybillId: '',
      checkGroup: [],
      checkList: [],
      waybillTitle: '',
      waybillInfoList: [], // 运单信息list
      receiveClientInfo: {}, // 收货方信息
      sendClientInfo: {}, // 发货方信息
      packageInfoData: [], // 货品信息
      receivablesTableData: [], // 收款信息
      waybillFinanceOperateList: [], // 财务信息list
      pageIndex: '' // 返回
    }
  },
  watch: {
    $route (newVal, oldVal) {
      let title = newVal.query.waybillTitle
      this.waybillTitle = title
    }
  },
  created () {
    let title = this.$route.query.waybillTitle
    this.waybillTitle = title
    let waybillId = this.$route.query.waybillId
    this.queryWaybillInfo(waybillId)
    // this.printWaybillId = waybillId
    // this.checkGroup = [...ENUMS.checkGroup]
    // this.checkList = this.checkGroup.map(item => {
    //   return item.label
    // })
  },
  methods: {
    printList () { // 打印
      setTimeout(() => {
        this.$refs.printComponent.init()
      }, 10)
    },
    goBack () {
      let waybillTitle = this.$route.query.waybillTitle
      if (waybillTitle === '全部运单') {
        this.$router.push({name: 'PfAllWaybill'})
      }
    },
    queryWaybillInfo (val) { // 详情
      WaybillAjax.QueryWbillDetail({waybillId: val}).then(res => {
        if (res.code === 200) {
          this.waybillNumber = res.data.waybillNumber
          this.receiveClientInfo = res.data.receiveClientInfo
          this.sendClientInfo = res.data.sendClientInfo
          let packageInfoObj = {
            packageName: res.data.packageName,
            packageQuantity: res.data.packageQuantity,
            remark: res.data.remark
          }
          this.packageInfoData.push(packageInfoObj)
          this.receivablesTableData = res.data.waybillFeeVoList
          this.waybillFinanceOperateList = res.data.waybillOperateVoList
          this.waybillInfoList = res.data.waybillTransportVoList
        }
      })
    }
  },
  components: {
    // PrintWayAndBoxBill
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.PfWaybillDetail {
  .card_form_title {
    .w-title {
      margin-left: 40px;
      font-size: 14px;
    }
    .w-num {
      font-size: 14px;
    }
  }
  .addressDetail .el-input__inner {
     width: 605px !important;
  }
}
</style>

<style lang="less" scoped>
@import '../../../style/base.less';
.PfWaybillDetail {
  .transInfo {
    width: 100%;
    height: 120px;
    display: flex;
    .tsInfo-item {
      width: 20%;
      height: 120px;
      // border: 1px solid #000;
      display: flex;
      .item-left {
        height: 120px;
        width: 60%;
        // border: 1px solid #f00;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .item-text {
          width: 100%;
          height: 25px;
          line-height: 25px;
          text-align: center;
        }
      }
      .item-right {
        height: 120px;
        width: 40%;
        // border: 1px solid #f00;
        .item-driver {
          width: 100%;
          height: 25px;
          margin-top: 40px;
          text-align: center;
        }
        .item-line {
          width: 100%;
          height: 1px;
          background-color: #000;
        }
      }
    }
  }
  .basicInfo {
    .box {
      width: 100%;
      height: 270px;
      border: solid 1px #e6ecf8;
      .box_head {
        width: 100%;
        height: 35px;
        background: #f0f2fa;
      .box_head_li {
        width: 50%;
        float: left;
        height: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 13px;
      }
      .box_head_li:first-child {
        border-right: 1px solid #e6ecf8;
      }
      }
      .box_left {
        width: 50%;
        height: 235px;
        float: left;
        border-right: 1px solid #e6ecf8;
        .box_main {
          margin: 23px 0 0 54px;
          .box_li {
            margin-bottom: 30px;
            span {
              font-size: 13px;
            }
          }
          .box_li span:first-child {
            width: 70px;
            display: inline-block;
          }
        }
      }
      .box_right {
        float: left;
        height: 235px;
        width: 50%;
        .box_main {
          margin: 23px 0 0 54px;
          .box_li {
            margin-bottom: 30px;
            span {
              font-size: 13px;
            }
          }
          .box_li span:first-child {
            width: 70px;
            display: inline-block;
          }
        }
      }
    }

  }

  .wayInfoBox {
      width: 100%;
      height: 62px;
      border: solid 1px #e6ecf8;
      .box_left {
        width: 50%;
        height: 62px;
        line-height: 62px;
        float: left;
        border-right: 1px solid #e6ecf8;
        .box_main {
          margin-left: 54px;
          span {
            font-size: 13px;
          }
            .box_li span:first-child {
            width: 70px;
            display: inline-block;
          }
        }
      }
      .box_right {
        width: 50%;
        height: 62px;
        line-height: 62px;
        float: left;
        .box_main {
          margin-left: 54px;
          span {
            font-size: 13px;
          }
          .box_li span:first-child {
            width: 70px;
            display: inline-block;
          }
        }
      }
  }

  .waybillInfo {
      width: 100%;
      height: 239px;
      border: solid 1px #e6ecf8;
      .waybillInfoBox {
        overflow: auto;
        height: 100%;
        padding: 23px 0 23px 54px;
        .box_left {
          float: left;
          width: 50%;
        }
        .box_right {
          float: left;
          width: 50%;
        }
        .box_main li {
          margin-bottom: 23px;
          span {
            font-size: 13px;
          }
        }
      }
  }
  .info {
    margin-bottom: 30px;
    font-size: 13px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
      .radio-con {
        height: 32px;
        line-height: 32px;
        float: left;
        margin-right: 30px;
      }
      .btn-con {
        height: 32px;
        line-height: 32px;
        float: left;
      }
    }
  }
}
</style>
