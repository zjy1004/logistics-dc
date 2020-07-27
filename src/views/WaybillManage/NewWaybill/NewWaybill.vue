<template>
  <div class="new-waybill">
    <div class="public_card">
      <div class="card_main">
        <div class="c-wraper">
          <!-- 收货方信息 -->
          <div class="c-item">
            <div class="i-title">收<br/>货<br/>方<br/>信<br/>息</div>
            <div class="i-content">
              <el-form :inline="true" ref="receiveForm" :model="receiveForm" label-width="100px">
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="收货方名称:" class="receiveType">
                      <el-input
                        ref="receiveClientName"
                        @input="search($event, 'clientName', receiveForm.clientName, 'receiveForm')"
                        @keyup.native.stop="shortcutKeyUp"
                        @blur="blurFormInput('receiveForm')"
                        v-model.trim="receiveForm.clientName"
                        placeholder="请输入收货方名称">
                      </el-input>
                      <div v-if="receiveForm.isInput === 'clientName'" class="receiveNameLeft tableDivLeft positionDiv">
                        <search-table
                          ref="searchTable"
                          :type="'receive'"
                          :tableData="receiveSearchTable"
                          @click-select-table-row="clickSelectTableRow"
                        >
                        </search-table>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系电话:" class="receiveType">
                      <el-input
                        @input="search($event, 'phone', receiveForm.phone, 'receiveForm')"
                        @keyup.native.stop="shortcutKeyUp"
                        @blur="blurFormInput('receiveForm')"
                        v-model.trim="receiveForm.phone"
                        maxlength="11"
                        placeholder="请输入联系电话">
                      </el-input>
                      <div v-if="receiveForm.isInput === 'phone'" class="receivePhoneLeft tableDivRightLast positionDiv">
                        <search-table
                          ref="searchTable"
                          :type="'receive'"
                          :tableData="receiveSearchTable"
                          @click-select-table-row="clickSelectTableRow"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="客户编码:" class="receiveType">
                      <el-input
                        disabled
                        v-model="receiveForm.clientCode"
                        placeholder="请输入客户编码">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="分拨中心名称:" class="receiveType">
                      <el-select v-model="receiveForm.dcId" placeholder="请选择分拨中心" disabled clearable>
                        <el-option
                          v-for="(item, index) in dcOptions"
                          :key="index"
                          :label="item.dcName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="16" :offset="1">
                    <el-form-item label="收货地址:" class="receiveType">
                      <el-input
                        class="addressType"
                        v-model="receiveForm.address"
                        placeholder="请输入收货地址">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 发货方信息 -->
          <div class="c-item">
            <div class="i-title">发<br/>货<br/>方<br/>信<br/>息</div>
            <div class="i-content">
              <el-form :inline="true" ref="sendForm" :model="sendForm" label-width="100px">
                <el-row :span="24">
                  <el-col :span="1">
                    <div class="lock-wrap">
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        popper-class="porper-class"
                        :content="sendForm.lockSendInfo ? '点击解锁后, 不保留发货方信息' : '点击锁定后, 提交运单将保留发货方信息'">
                        <div class="lock" :class="{'open-lock': !sendForm.lockSendInfo}" @click="lockSendVal()" slot="reference"></div>
                      </el-popover>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发货方名称:" class="sendType">
                      <el-input
                        ref="sendClientName"
                        @input="search($event, 'clientName', sendForm.clientName, 'sendForm')"
                        @keyup.native.stop="shortcutKeyUp"
                        @blur="blurFormInput('sendForm')"
                        v-model.trim="sendForm.clientName"
                        placeholder="请输入发货方名称">
                      </el-input>
                      <div v-if="sendForm.isInput === 'clientName'" class="receiveNameLeft tableDivLeft positionDiv">
                        <search-table
                          ref="searchTable"
                          :type="'send'"
                          :tableData="sendSearchTable"
                          @click-select-table-row="clickSelectTableRow"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系电话:" class="sendType">
                      <el-input
                        ref="sendPhone"
                        @input="search($event, 'phone', sendForm.phone, 'sendForm')"
                        @keyup.native.stop="shortcutKeyUp"
                        @blur="blurFormInput('sendForm')"
                        v-model.trim="sendForm.phone"
                        maxlength="11"
                        placeholder="请输入联系电话">
                      </el-input>
                      <div v-if="sendForm.isInput === 'phone'" class="receivePhoneLeft tableDivRightLast positionDiv">
                        <search-table
                          ref="searchTable"
                          :type="'send'"
                          :tableData="sendSearchTable"
                          @click-select-table-row="clickSelectTableRow"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="客户编码:" class="sendType">
                      <el-input
                        disabled
                        v-model="sendForm.clientCode"
                        placeholder="请输入客户编码">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="分拨中心名称:" class="sendType">
                      <el-select v-model="sendForm.dcId" placeholder="请选择分拨中心" disabled clearable>
                        <el-option
                          v-for="(item, index) in dcOptions"
                          :key="index"
                          :label="item.dcName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="16" :offset="1">
                    <el-form-item label="发货地址:" class="sendType">
                      <el-input
                        ref="sendAddress"
                        class="addressType"
                        v-model="sendForm.address"
                        placeholder="请输入发货地址">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 线路信息 -->
          <div class="c-item">
            <div class="i-title">线&nbsp;路<br/>信&nbsp;息</div>
            <div class="i-content">
              <el-form :inline="true" ref="form" :model="form" label-width="100px">
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="线路:" class="receiveType">
                      <el-select v-model="form.lineId" placeholder="请选择线路">
                        <el-option
                          v-for="(item, index) in lineOptions"
                          :key="index"
                          :label="item.lineName"
                          :value="item.lineId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="班次:" class="receiveType">
                      <el-select v-model="form.shiftId" placeholder="请选择班次" clearable>
                        <el-option
                          v-for="(item, index) in shiftOptions"
                          :key="index"
                          :label="item.shiftName"
                          :value="item.shiftId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 货物信息 -->
          <div class="c-item">
            <div class="i-title">货<br/>物<br/>信<br/>息</div>
            <div class="i-content">
              <el-form :inline="true" ref="form" :model="form" label-width="100px">
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="货品信息:" class="receiveType">
                      <el-input
                        ref="pageInfo"
                        class="textAreaType"
                        type="textarea"
                        :rows="2"
                        :resize="'none'"
                        maxlength="50"
                        v-model="form.packageName"
                        placeholder="请输入货品信息">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="件数:" class="receiveType">
                      <el-input-number
                        ref="packageQuantity"
                        :min="1"
                        :step-strictly="true"
                        v-model="form.packageQuantity"
                        @keyup.native.stop="comKeyEvent($event, 'packageQuantity')"
                        placeholder="请输入件数">
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="16" :offset="1">
                    <el-form-item label="运单备注:" class="receiveType">
                      <el-input
                        ref="remark"
                        class="addressType"
                        v-model="form.remark"
                        maxlength="30"
                        @keyup.native.stop="comKeyEvent($event, 'remark')"
                        placeholder="请输入备注（最长30个字）">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 收款信息 -->
           <div class="c-item">
            <div class="i-title">收&nbsp;款<br/>信&nbsp;息</div>
            <div class="i-content">
              <el-form :inline="true" ref="form" :model="form" label-width="110px">
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="运费付款方:" class="receiveType">
                      <el-radio-group v-model="form.freightPayer">
                        <el-radio :label="2">收方付</el-radio>
                        <el-radio :label="1">发方付</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运费结算方式:" class="receiveType">
                      <el-radio-group v-model="form.freightSettlementMethod" disabled>
                        <el-radio :label="1">现结</el-radio>
                        <el-radio :label="2">月结</el-radio>
                        <el-radio :label="3">包月</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="8" :offset="1">
                    <el-form-item label="运费:" class="receiveType">
                      <el-input
                        :disabled="freightDisabled"
                        ref="freight"
                        @input="inputMoney($event, 'freight', form.freight)"
                        @keyup.native.stop="comKeyEvent($event, 'freight')"
                        v-model="form.freight"
                        placeholder="请输入运费">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="代收货款:" class="receiveType">
                      <el-input
                        ref="goods"
                        @input="inputMoney($event, 'goods', form.goods)"
                        v-model="form.goods"
                        placeholder="请输入代收货款">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 打印与提交 -->
          <div class="bottom">
            <div class="radio-con">
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="checkItem.label" :key="index" v-for="(checkItem,index) in checkGroup">{{checkItem.text}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="radio-con">
              <div>应收金额：<span class="redColor">{{shouldReceive}}元</span></div>
            </div>
            <div class="sunmit-con">
              <el-button ref="submitBtn" :disabled="disableSubmit" class="btn-main" @click="submitBill">提交（ctrl + enter）</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 三联运单与箱单 -->
    <print-way-and-box-bill
      ref="printComponent"
      :waybillId="waybillId"
      :checkList="checkList"
    />
  </div>
</template>

<script>
import SearchTable from './subpage/SearchTable'
import WaybillManageAjax from '@/api/WaybillManage/WaybillManage'
import ENUMS from '@/enums/enums'
import PrintWayAndBoxBill from './subpage/printWayBoxBill'
let page
export default {
  name: 'NewWaybill',
  components: {
    SearchTable,
    PrintWayAndBoxBill
  },
  props: {},
  data () {
    return {
      receiveForm: {
        address: '',
        addressId: '',
        clientName: '',
        clientType: '',
        dcId: '',
        dcName: '',
        freightSettlementMethod: '',
        id: '',
        lineId: '',
        lineName: '',
        phone: '',
        isInput: ''
      },
      sendForm: {
        lockSendInfo: false,
        address: '',
        addressId: '',
        clientName: '',
        clientType: '',
        dcId: '',
        dcName: '',
        freightSettlementMethod: '',
        id: '',
        lineId: '',
        lineName: '',
        phone: '',
        isInput: ''
      },
      form: {
        lineId: '',
        shiftId: '',
        waybillDeliveryType: '',
        packageName: '配件',
        packageQuantity: 1,
        remark: '',
        freightPayer: 2,
        freightSettlementMethod: 1,
        freight: 0,
        goods: 0
      },
      saveDefaultFreight: '',
      freightDisabled: false,
      receiveSearchTable: [],
      sendSearchTable: [],
      currentIndex: '',
      currentRow: null,
      dcOptions: [],
      shiftOptions: [],
      lineOptions: [],
      checkList: [],
      checkGroup: [],
      disableSubmit: false,
      waybillId: ''
    }
  },
  watch: {
    lineId (newVal, oldVal) {
      if (newVal !== '') {
        if (this.lineOptions.length > 0) {
          this.lineOptions.forEach(item => {
            if (item.lineId === newVal) {
              if (this.form.freightSettlementMethod === 3) {
                this.form.freight = 0
              } else {
                this.form.freight = item.defaultFreight
              }
              this.shiftOptions = item.shiftVos
              if (item.shiftVos.length > 0) {
                this.form.shiftId = item.shiftVos[0].shiftId
              }
            }
          })
        }
      } else {
        this.shiftOptions = []
        this.form.shiftId = ''
      }
    },
    packageQuantity (newVal, oldVal) {
      if (newVal === undefined) { // 包裹数为空时
        this.$nextTick(() => {
          this.form.packageQuantity = 1
        })
      }
    },
    freightPayer (newVal, oldVal) {
      // if (this.saveDefaultFreight !== 0) { // 有默认运费切换付款方
      //   this.form.freight = this.saveDefaultFreight
      // } else {
      //   this.form.freight = 0
      // }
      if (this.form.freightSettlementMethod === 1) {
        this.form.freight = this.saveDefaultFreight
      }
      if (newVal === 1) { // 发货方运费结算方式
        if (this.sendForm.freightSettlementMethod !== '') {
          this.form.freightSettlementMethod = this.sendForm.freightSettlementMethod
        } else {
          this.form.freightSettlementMethod = 1
        }
      }
      if (newVal === 2) { // 收货方运费结算方式
        if (this.receiveForm.freightSettlementMethod !== '') {
          this.form.freightSettlementMethod = this.receiveForm.freightSettlementMethod
        } else {
          this.form.freightSettlementMethod = 1
        }
      }
    },
    freightSettlementMethod (newVal, oldVal) {
      if (newVal === 3) { // 包月时运费为0且不可编辑
        this.form.freight = 0
        this.freightDisabled = true
      } else {
        this.freightDisabled = false
        this.form.freight = this.saveDefaultFreight
      }
    }
  },
  computed: {
    lineId () {
      return this.form.lineId
    },
    packageQuantity () {
      return this.form.packageQuantity
    },
    freightPayer () {
      return this.form.freightPayer
    },
    freightSettlementMethod () {
      return this.form.freightSettlementMethod
    },
    shouldReceive () {
      if (this.form.freightSettlementMethod === 1) { // 运费结算方式现结 应收=运费+货款
        return (Number(this.form.freight) + Number(this.form.goods)).toFixed(2) || 0
      } else { // 运费结算方式现结 应收=货款
        return Number(this.form.goods).toFixed(2) || 0
      }
    }
  },
  created () {
    this.init()
    this.checkGroup = [...ENUMS.checkGroup]
    this.checkList = this.checkGroup.map(item => {
      return item.label
    })
  },
  mounted () {
    this.$refs.receiveClientName.focus()
    document.removeEventListener('keydown', this.shortcuKeyEvent)
    page = this
    document.addEventListener('keydown', this.shortcuKeyEvent, true)
  },
  methods: {
    init () {
      this.queryDcList()
      let sendFormVal = JSON.parse(sessionStorage.getItem('sendFormVal'))
      if (sendFormVal) {
        this.sendForm = sendFormVal
      }
    },
    // 点击锁定发货方
    lockSendVal () {
      this.sendForm.lockSendInfo = !this.sendForm.lockSendInfo
    },
    queryDcList () { // 查询全部分拨中心list
      WaybillManageAjax.QueryDcList().then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
        }
      })
    },
    queryLineAndShift (val) { // 查询线路班次
      WaybillManageAjax.QueryNewWaybillLineAndShift(val).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.lineOptions = res.data
            this.form.lineId = res.data[0].lineId
            this.form.waybillDeliveryType = res.data[0].lineType
            this.saveDefaultFreight = res.data[0].defaultFreight
          } else {
            this.saveDefaultFreight = 0
          }
        }
      })
    },
    // 查询全部收发货方客户信息
    queryClientData (val, flag) {
      WaybillManageAjax.GetNewWaybillClient(val).then(res => {
        if (res.code === 200) {
          if (flag === 'receive') {
            this.receiveSearchTable = res.data
            if (this.receiveSearchTable.length > 0) {
              this.currentIndex = 0
              this.currentRow = this.receiveSearchTable[0]
              this.setCurrentRow()
            }
          }
          if (flag === 'send') {
            this.sendSearchTable = res.data
            if (this.sendSearchTable.length > 0) {
              this.currentIndex = 0
              this.currentRow = this.sendSearchTable[0]
              this.setCurrentRow()
            }
          }
        }
      })
    },
    inputMoney (event, inputType, val) { // 保留俩位小数（数字）
      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 整数和俩位小数
        if (inputType === 'freight') {
          this.form.freight = val.match(/^\d{0,5}/g)[0] || null
        } else if (inputType === 'goods') {
          this.form.goods = val.match(/^\d{0,6}/g)[0] || null
        }
      } else {
        if (inputType === 'freight') {
          this.form.freight = val.match(/^\d{0,5}(\.?\d{0,2})/g)[0] || null
        } else if (inputType === 'goods') {
          this.form.goods = val.match(/^\d{0,6}(\.?\d{0,2})/g)[0] || null
        }
      }
      // let val = value.replace(/[^\d.]/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      // this.$nextTick(() => {
      //   event.target.value = val
      //   if (inputType === 'freight') {
      //     this.form.freight = val
      //   } else if (inputType === 'goods') {
      //     this.form.goods = val
      //   }
      // })
    },
    // enter后聚焦
    comKeyEvent (event, type) {
      if (event.keyCode === 13) {
        if (type === 'packageQuantity') {
          this.$refs.remark.focus()
        }
        if (type === 'remark') {
          this.$refs.freight.focus()
        }
        if (type === 'freight') {
          this.$refs.goods.focus()
        }
      }
    },
    // 快捷键提交
    shortcuKeyEvent (event) {
      if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) { // ctrl+enter提交
        if (this.disableSubmit) {
          return false
        }
        if (window.event) {
          // IE中阻止函数器默认动作的方式
          window.event.returnValue = false
        } else {
          event.preventDefault()
        }
        page.$refs.submitBtn.$el.click()
        page.disableSubmit = true
        // this.submitBill()
        document.removeEventListener('keydown', page.shortcuKeyEvent)
      } else if (event.keyCode === 81 && (event.ctrlKey || event.metaKey)) {
        this.searchWaybillVisible = true
      }
    },
    // 上下移动或回车事件
    shortcutKeyUp (event) {
      let val = event.target.value
      let editType = ''
      if (this.receiveForm.isInput !== '') {
        editType = 'receiveType'
      } else if (this.sendForm.isInput !== '') {
        editType = 'sendType'
      } else if (this.driverFlag !== '') {
        editType = 'driverType'
      }
      if (event.keyCode === 40) { // 下
        if (val.length > 0) {
          if (editType === 'receiveType' && this.receiveSearchTable.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.receiveSearchTable[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.receiveSearchTable[newIndex]
            } else if (this.receiveSearchTable.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.receiveSearchTable[0]
            } else if (this.receiveSearchTable.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'sendType' && this.sendSearchTable.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.sendSearchTable[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.sendSearchTable[newIndex]
            } else if (this.sendSearchTable.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.sendSearchTable[0]
            } else if (this.sendSearchTable.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'driverType' && this.driverListSearchData.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.driverListSearchData[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.driverListSearchData[newIndex]
            } else if (this.driverListSearchData.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.driverListSearchData[0]
            } else if (this.driverListSearchData.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
        }
      } else if (event.keyCode === 38) { // 上
        if (val.length > 0) {
          if (editType === 'receiveType' && this.receiveSearchTable.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.receiveSearchTable[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.receiveSearchTable[newIndex]
            } else if (this.receiveSearchTable.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.receiveSearchTable.length - 1
              this.currentRow = this.receiveSearchTable[this.currentIndex]
            } else if (this.receiveSearchTable.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'sendType' && this.sendSearchTable.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.sendSearchTable[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.sendSearchTable[newIndex]
            } else if (this.sendSearchTable.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.sendSearchTable.length - 1
              this.currentRow = this.sendSearchTable[this.currentIndex]
            } else if (this.sendSearchTable.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'driverType' && this.driverListSearchData.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.driverListSearchData[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.driverListSearchData[newIndex]
            } else if (this.driverListSearchData.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.driverListSearchData.length - 1
              this.currentRow = this.driverListSearchData[this.currentIndex]
            } else if (this.driverListSearchData.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
        }
      }
      this.setCurrentRow()
      if (event.keyCode === 13) { // 回车
        if (this.currentRow) {
          this.selectTableRow(this.currentRow, event)
        }
      }
    },
    // 模糊搜索
    search (event, searchColName, val, editFormType) {
      this.$nextTick(() => {
        this.disableSubmit = false
        let value = event
        if (value === '') {
          this.receiveForm.isInput = ''
          this.sendForm.isInput = ''
          return false
        }
        this.disableSubmit = false
        if (searchColName === 'phone') {
          value = this.validateOnlyNum(value)
          this.$nextTick(() => {
            event = value
          })
        }
        if (editFormType === 'receiveForm') { // 搜索收货方
          this.receiveForm.isInput = searchColName
          let postObj = {
            clientName: searchColName === 'clientName' ? this.receiveForm.clientName : '',
            phone: searchColName === 'phone' ? this.receiveForm.phone : '',
            selectType: 2
          }
          this.queryClientData(postObj, 'receive')
        } else if (editFormType === 'sendForm') { // 搜索发货方
          this.sendForm.isInput = searchColName
          let postObj = {
            clientName: searchColName === 'clientName' ? this.sendForm.clientName : '',
            phone: searchColName === 'phone' ? this.sendForm.phone : '',
            selectType: 1
          }
          this.queryClientData(postObj, 'send')
        }
      })
    },
    // 设置当前行
    setCurrentRow () {
      this.$nextTick(() => {
        if (this.$refs.searchTable) {
          this.$refs.searchTable.$children[0].setCurrentRow(this.currentRow)
        }
      })
    },
    // 模糊搜索输入框失去焦点
    blurFormInput (editFormType) {
      setTimeout(() => {
        if (editFormType === 'receiveForm') {
          this.receiveForm.isInput = ''
        } else if (editFormType === 'sendForm') {
          this.sendForm.isInput = ''
        }
        this.currentRow = null
      }, 200)
    },
    // 客户表格行点击
    clickSelectTableRow (row, event) {
      this.selectTableRow(row, event)
    },
    // 选中某行数据
    selectTableRow (row, event) {
      // 跳转下一处
      this.nextFocus()
      let selectTableType = ''
      let { path } = event
      let len = path.length
      for (let i = 0; i < len; i++) {
        if (path[i].className.includes('receiveType')) {
          selectTableType = 'receiveType'
          break
        } else if (path[i].className.includes('sendType')) {
          selectTableType = 'sendType'
          break
        }
      }
      if (selectTableType === 'receiveType') { // 收货方
        this.receiveForm.id = row.id
        this.receiveForm.clientName = row.clientName
        this.receiveForm.clientCode = row.clientCode
        this.receiveForm.phone = row.phone
        this.receiveForm.address = row.address
        this.receiveForm.addressId = row.addressId
        this.receiveForm.freightSettlementMethod = row.freightSettlementMethod
        this.receiveForm.lineId = row.lineId
        this.receiveForm.lineName = row.lineName
        this.receiveForm.dcName = row.dcName
        this.receiveForm.dcId = row.dcId
        this.receiveForm.clientType = row.clientType
        this.receiveForm.isInput = ''
        if (this.form.freightPayer === 2) {
          this.form.freightSettlementMethod = row.freightSettlementMethod
        }
        let paramObj = {
          sendDc: this.sendForm.dcId,
          receiveDc: this.receiveForm.dcId,
          receiveClient: this.receiveForm.id
        }
        this.queryLineAndShift(paramObj)
      } else if (selectTableType === 'sendType') { // 发货方
        this.sendForm.id = row.id
        this.sendForm.clientName = row.clientName
        this.sendForm.clientCode = row.clientCode
        this.sendForm.phone = row.phone
        this.sendForm.address = row.address
        this.sendForm.addressId = row.addressId
        this.sendForm.freightSettlementMethod = row.freightSettlementMethod
        this.sendForm.lineId = row.lineId
        this.sendForm.lineName = row.lineName
        this.sendForm.dcName = row.dcName
        this.sendForm.dcId = row.dcId
        this.sendForm.clientType = row.clientType
        this.sendForm.isInput = ''
        if (this.form.freightPayer === 1) {
          this.form.freightSettlementMethod = row.freightSettlementMethod
        }
        let paramObj = {
          sendDc: this.sendForm.dcId,
          receiveDc: this.receiveForm.dcId,
          receiveClient: this.receiveForm.id
        }
        this.queryLineAndShift(paramObj)
      }
    },
    // 收发货方选中某行后光标自动聚焦至下一处编辑
    nextFocus () {
      if (this.receiveForm.isInput !== '') { // 当前编辑的是收货方
        if (this.receiveForm.isInput === 'clientName') { // 收货方名称
          this.$refs.sendClientName.focus()
        } else if (this.receiveForm.isInput === 'phone') { // 收货方电话
          this.$refs.sendClientName.focus()
        } else if (this.receiveForm.isInput === 'address') { // 收货方地址
          this.$refs.sendClientName.focus()
        }
      }
      if (this.sendForm.isInput !== '') { // 当前编辑的是发货方
        this.$refs.packageQuantity.focus()
      }
    },
    // 格式化提交请求数据
    formatPostData () {
      let curDate = new Date()
      let currentTime = curDate.getTime()
      let postData = {
        currentTime: currentTime,
        fkLine: this.form.lineId,
        freight: this.form.freight,
        freightPayer: this.form.freightPayer,
        goods: this.form.goods,
        packageName: this.form.packageName,
        packageQuantity: this.form.packageQuantity,
        receiveAddress: this.receiveForm.address,
        receiveClient: this.receiveForm.id,
        receiveClientName: this.receiveForm.clientName,
        receiveDc: this.receiveForm.dcId,
        receivePhone: this.receiveForm.phone,
        receiveSettlementMethod: this.receiveForm.freightSettlementMethod,
        remark: this.form.remark,
        sendAddress: this.sendForm.address,
        sendClient: this.sendForm.id,
        sendClientName: this.sendForm.clientName,
        sendDc: this.sendForm.dcId,
        sendDcName: this.sendForm.dcName,
        sendPhone: this.sendForm.phone,
        sendSettlementMethod: this.sendForm.freightSettlementMethod,
        settlementMethod: this.form.freightSettlementMethod,
        shiftId: this.form.shiftId,
        waybillDeliveryType: this.form.waybillDeliveryType,
        waybillId: '',
        waybillNumber: ''
      }
      return postData
    },
    // 打印运单
    printBill () {
      setTimeout(() => {
        this.$refs.printComponent.init()
      }, 10)
    },
    // 验证表单信息
    validatePostData () {
      // 只提示第一处不满足
      let result = {
        flag: true,
        message: ''
      }
      if (this.receiveForm.id === '' || this.receiveForm.clientName === '' || this.receiveForm.phone === '') {
        result.flag = false
        result.message = '请完善收货方信息!'
        return result
      }
      if (this.sendForm.id === '' || this.sendForm.clientName === '' || this.sendForm.phone === '') {
        result.flag = false
        result.message = '请完善发货方信息!'
        return result
      }
      if (this.form.lineId === '') {
        result.flag = false
        result.message = '请选择线路!'
        return result
      }
      if (this.form.shiftId === '') {
        result.flag = false
        result.message = '请选择班次!'
        return result
      }
      // if (this.form.packageName === '') {
      //   result.flag = false
      //   result.message = '请完善货品信息!'
      //   return result
      // }
      return result
    },
    // 开单提交
    submitBill () {
      let postData = this.formatPostData()
      let validateResult = this.validatePostData()
      if (!validateResult.flag) {
        // setTimeout(() => {
        //   this.disableSubmit = false
        // }, 1000)
        this.$notify({
          message: `${validateResult.message}`,
          type: 'error'
        })
        return
      }
      this.disableSubmit = true
      WaybillManageAjax.CreatWaybill(postData).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '新建运单成功！',
            type: 'success'
          })
          this.waybillId = res.data
          if (this.sendForm.lockSendInfo) {
            sessionStorage.setItem('sendFormVal', JSON.stringify(this.sendForm))
          } else {
            sessionStorage.removeItem('sendFormVal')
          }
          if (this.checkList.length > 0) {
            this.printBill()
          } else {
            setTimeout(() => {
              this.$router.go(0)
            }, 500)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../style/base.less';
.new-waybill{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  .public_card {
    .card_main {
      overflow-x: auto;
    }
  }
  .c-wraper {
    display: flex;
    flex: 1;
    flex-direction: column;
    border: 1px solid #eee;
    min-width: 1020px;
    .c-item {
      display: flex;
      .i-title {
        display: flex;
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        padding: 5px 0;
      }
      .i-content {
        display: flex;
        flex: 9;
        flex-direction: column;
      }
      .lock-wrap {
        width: 100%;
        height: 43px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .lock {
        width: 24px;
        height: 24px;
        border: none;
        outline: none;
        cursor: pointer;
        background: url('../../../image/lock.png') no-repeat;
        background-size: 100%;
      }
      .open-lock {
        width: 24px;
        height: 23px;
        border: none;
        outline: none;
        cursor: pointer;
        background: url('../../../image/open_lock.png') no-repeat;
        background-size: 100%;
      }
    }
    .bottom {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 20px;
      padding-right: 80px;
      .radio-con {
        margin-right: 40px;
        .redColor {
          color: red;
        }
      }
    }
  }
}
</style>
<style lang="less">
.new-waybill{
  .el-table__body-wrapper{
    max-height: 400px!important;
    overflow-y: auto;
  }
  .el-table__body tr.current-row>td{
    // background-color: #f7f7f7 !important;
  }
  .receiveNameLeft{
    .customerNameCol{
      background: #04B8D7;
    }
  }
  .receivePhoneLeft{
    .customerPhoneCol{
      background: #04B8D7;
    }
  }
  .receiveAddressLeft{
    .addressCol{
      background: #04B8D7;
    }
  }
  .card_main {
    // padding: 20px;
    .el-form .el-row {
      position: static!important;
      border-bottom: 1px solid #ebecf0;
    }
    .el-form-item{
      width: 100%;
      display: flex!important;
      flex-direction: row;
      position: relative;
      .positionDiv{
        display: flex;
        flex: 1;
        width: 240%;
        position: absolute;
        top: 40px;
        z-index: 10;
        background: #ccc;
      }
      .tableDivLeft{
        left: 0px;
      }
      .tableDivRight{
        right: -4%;
      }
      .tableDivRightLast{
        right: 4%;
      }
      .el-form-item__content{
        display: flex;
        flex: 1;
        .el-input__inner{
          width: 100%;
          border: none;
        }
        .el-select {
          width: 198px!important;
        }
        .el-input-number {
          width: 198px;
          line-height: 29px;
          .el-input-number__decrease {
            height: 29px;
            line-height: 29px;
            width: 35px;
          }
          .el-input-number__increase {
            height: 29px;
            line-height: 29px;
            width: 35px;
          }
          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
        .el-input-group__append, .el-input-group__prepend{
          background-color: #fff;
          border: none;
          color: #333;
        }
      }
      .el-radio-group {
        display: flex;
        align-items: center;
      }
    }
    .addressType .el-input__inner{
      // width: 350px!important;
    }
    .textAreaType .el-textarea__inner{
      // width: 350px!important;
      border: none!important;
    }
  }
}
</style>
