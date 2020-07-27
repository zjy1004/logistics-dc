<template>
  <div class="create-dc">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">分拨中心管理</span></h3>
      <div class="card_main">
        <div class="card_con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="100px">
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">基本信息</span>
            </div>
            <div class="info">
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="分拨中心名称:" prop="distributionCenterName">
                    <el-input v-model="form.distributionCenterName" maxlength="10" :disabled="pageType === 'check'" placeholder="请输入分拨中心名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="运营公司:" prop="operationCompanyId">
                    <el-select v-model="form.operationCompanyId" :disabled="pageType === 'check'"  placeholder="请选择运营公司" clearable>
                      <el-option
                        v-for="(item, index) in operationList"
                        :key="index"
                        :label="item.companyAbbreviation"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="distributionCenterPhone">
                    <el-input v-model="form.distributionCenterPhone" :disabled="pageType === 'check'" @keyup.native="validPhone" maxlength="11"  placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="23" :offset="1">
                  <el-form-item label="经营地址:" prop="provinceCode">
                    <el-select v-model="form.provinceCode" :disabled="pageType === 'check'" placeholder="请选择省">
                      <el-option
                        v-for="(item, index) in areaPList"
                        :key="index"
                        :label="item.areaName"
                        :value="item.areaCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="cityCode">
                    <el-select v-model="form.cityCode" :disabled="pageType === 'check'" placeholder="请选择市">
                      <el-option
                        v-for="(item, index) in areaCList"
                        :key="index"
                        :label="item.areaName"
                        :value="item.areaCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="areaCode">
                    <el-select v-model="form.areaCode" :disabled="pageType === 'check'" placeholder="请选择区">
                      <el-option
                        v-for="(item, index) in areaQList"
                        :key="index"
                        :label="item.areaName"
                        :value="item.areaCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="areaInfo">
                    <el-input class="addressDetail" v-model="form.areaInfo" :disabled="pageType === 'check'" placeholder="请输入详细经营地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">佣金配置</span>
            </div>
            <!-- 按比例收费 -->
            <div class="receiptMoney-top">
              <el-form :inline="true" ref="form" label-position="left" :model="form" :rules="rules" label-width="100px">
                <el-row>
                  <el-col :span="3">
                    <el-form-item>
                      <el-radio v-model="radio1" :disabled="pageType === 'check'" label="10">按比例收费</el-radio>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="代收手续费率:" prop="logisticsCloud">
                      <el-input v-model="form.goodsCommissionRate" @keyup.native="inputLogistics()" :disabled="radio1 !== '10' || pageType === 'check'" placeholder="请输入代收手续费率">
                        <template slot="append">‰</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- 阶梯收费 -->
            <div class="receiptMoney">
              <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="rules" label-width="100px">
                <el-row  v-for="(item, index) in configList" :key="index">
                  <el-col :span="3">
                    <el-form-item >
                      <span style="margin-left: 5px;"></span>
                      <el-radio v-if="index === 0"  v-model="radio1" :disabled="pageType === 'check'" label="20">阶梯价格收费</el-radio>
                    </el-form-item>
                  </el-col>
                  <el-col :span="21">
                    <div class="configRow">
                      <span class="leftText">当货款为:</span>
                      <span class="leftPrice">{{item.goodsStart}}元</span>
                      <span style="margin-right: 10px;">至</span>
                      <el-form-item label="" prop="goodsEnd">
                        <el-input v-model="item.goodsEnd" maxlength="6"  @keyup.native="keyupGoodsEnd(item.goodsEnd, index, $event)" :disabled="(radio1 === '10') || (index !== 0 && index !== configList.length - 1 || index === 0 && configList.length > 1) || pageType === 'check'"></el-input>
                      </el-form-item>
                      <span>元</span>
                      <span style="margin-left: 5px; display: inline-block; width: 100px;">(不含{{item.goodsEnd}}元)</span>
                      <el-form-item label="代收手续费用:" prop="poundageFee">
                        <el-input v-model="item.poundageFee" @keyup.native="keyupPoundageFee(item.poundageFee, index,$event,)" :disabled="radio1 === '10' || pageType === 'check'"></el-input>
                      </el-form-item>
                      <span style="margin-right: 20px;">元</span>
                      <el-button v-if="index === configList.length - 1 && pageType !== 'check'" @click="addRow('add', item, index)" :disabled="radio1 === '10' || AddButtonDisabled">添加</el-button>
                      <el-button v-if="index !== 0 && index === configList.length - 1 && pageType !== 'check'" @click="reduceRow(index)" :disabled="radio1 === '10'">删除</el-button>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">
                    <el-form-item>
                      <el-radio v-if="false" v-model="radio1" label="20">阶梯价格收费</el-radio>
                    </el-form-item>
                  </el-col>
                  <el-col :span="21">
                    <div class="configRow">
                      <span class="leftText" style="visibility:hidden">当货款为:</span>
                      <span class="leftPrice">{{endPrice}}元</span>
                      <span>及以上</span>
                      <el-input style="visibility:hidden; margin-right: 2px;"></el-input>
                      <span style="margin-left: 5px; display: inline-block; width: 100px;"></span>
                      <el-form-item label="代收手续费用:" prop="poundageFee">
                        <el-input v-model="endserviceCharge" @keyup.native="keyupLastPoundageFee('endserviceCharge', endserviceCharge, null, $event)" :disabled="radio1 === '10' || pageType === 'check'"></el-input>
                      </el-form-item>
                      <span style="margin-right: 20px;">元</span>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-form>
        </div>
        <div class="card_btn">
          <div class="search-btn-con">
            <el-button class="btn-main" v-if="saveShow" @click="save('form')">保存</el-button>
            <el-button class="btn-common" @click="goBack()">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- <v-dialog
      v-if="showErrorDialog"
      title="提示"
      :width="'486px'"
      mainText="下游终点和路由配置线路终点不一致，无法保存，请重新配置线路!"
      :closeClickModal="false"
      :showCancel="false"
      :dialogVisible="showErrorDialog"
      @click-cancel="showErrorDialog = false"
      @click-sure="showErrorDialog = false"
    /> -->
  </div>
</template>

<script>
import DcManageAjax from '@/api/BasicManage/DcManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'CreateDc',
  data () {
    return {
      dcId: '',
      saveShow: true,
      poundageFeeMax: 5,
      dialogVisible: '',
      radio1: '10', // 单选val
      endserviceCharge: '', // 末尾代收手续费用
      form: {
        distributionCenterName: '', // 分拨中心名称
        operationCompanyId: '', // 运营公司
        distributionCenterPhone: '',
        dividedType: '10', // 佣金配置类型
        goodsCommissionRate: '', // 代收手续费率
        goodsAllList: [], // 阶梯收费list
        addressSaveData: { // 经营地址
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          areaInfo: ''
        },
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        areaInfo: ''
      },
      updateShowArea: {
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      operationList: [], // 运营公司list
      areaPList: [], // 省
      areaCList: [], // 市
      areaQList: [], // 区
      configList: [], // 阶梯配置集合
      rules: {
        distributionCenterName: [{ required: true, message: '请输入分拨中心名称', trigger: 'blur' }],
        operationCompanyId: [{ required: true, message: '请输入运营公司名称', trigger: 'blur' }],
        // phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
        provinceCode: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityCode: [{ required: true, message: '请选择市', trigger: 'change' }],
        areaCode: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入详细经营地址（如街道门牌号）', trigger: 'blur' }],
        goodsCommissionRate: [{ required: true, message: '请输入代收货款手续费率', trigger: 'blur' }]
      }
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.provinceCode = newVal
        this.areaPList.forEach(item => {
          if (this.form.addressSaveData.cityCode !== item) {
            this.form.cityCode = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.cityCode = newVal
        this.areaCList.forEach(item => {
          if (this.form.addressSaveData.areaCode !== item) {
            this.form.areaCode = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaCode = newVal
      }
    },
    areaInfo (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaInfo = newVal
      }
    },
    radio1 (newVal, oldVal) { // 监听单选框
      if (newVal === '10') {
        this.configList = []
        this.addRow('first', null)
        this.endserviceCharge = ''
        this.form.dividedType = '10'
      } else {
        this.form.goodsCommissionRate = ''
        this.form.dividedType = '20'
      }
    }
  },
  computed: {
    provinceCode () {
      return this.form.provinceCode
    },
    cityCode () {
      return this.form.cityCode
    },
    areaCode () {
      return this.form.areaCode
    },
    areaInfo () {
      return this.form.areaInfo
    },
    AddButtonDisabled () { // 添加按钮禁用
      return this.configList.some(item => {
        if (item.goodsEnd === '' || item.poundageFee === '') {
          return true
        } else {
          return false
        }
      })
    },
    endPrice () { // 末尾左侧货款价格
      if (this.configList.length > 0) {
        let index = this.configList.length - 1
        let num = Number(this.configList[index].goodsEnd)
        if (num || num > 0) {
          return num
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    pageType () {
      return this.$route.query.type
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let dcId = this.$route.query.id
      if (dcId) {
        this.dcId = dcId
      }
      if (this.pageType === 'add') {
        this.addRow('first', null)
        this.QueryAreaList({areaParentCode: 0}, 'province')
      }
      if (this.pageType === 'check') {
        this.updateInit(dcId)
        this.saveShow = false
      }
      if (this.pageType === 'edit') {
        this.updateInit(dcId)
      }
      this.QueryOpCoyList()
    },
    validPhone (evnet, value) {
      this.form.distributionCenterPhone = this.validateNum(this.form.distributionCenterPhone)
    },
    updateInit (id) {
      init.bind(this)(id)
      async function init (id) {
        await this.QueryDcInfo(id)
        this.QueryAreaList({areaParentCode: 0}, 'province')
        this.QueryAreaList({areaParentCode: this.updateShowArea.provinceCode}, 'city')
        this.QueryAreaList({areaParentCode: this.updateShowArea.cityCode}, 'area')
      }
    },
    QueryAreaList (val, flag) { // 省市
      BasicCommonAjax.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaPList = res.data
          }
          if (flag === 'city') {
            this.areaCList = res.data
          }
          if (flag === 'area') {
            this.areaQList = res.data
          }
        }
      })
    },
    QueryOpCoyList () { // 查询运营公司list
      BasicCommonAjax.QueryOpCoyList().then(res => {
        if (res.code === 200) {
          this.operationList = res.data
          if (res.data && res.data.length === 1) {
            this.form.operationCompanyId = res.data[0].id
          }
        }
      })
    },
    async QueryDcInfo (id) { // 分拨中心回显
      return new Promise((resolve, reject) => {
        DcManageAjax.QueryDcInfo({dcId: id}).then(res => {
          if (res.code === 200) {
            let goodsAllList = res.data.goodsAllList
            if (goodsAllList && goodsAllList.length > 1) {
              this.configList = goodsAllList.filter((item, index) => {
                return index !== goodsAllList.length - 1
              })
              this.endserviceCharge = goodsAllList[goodsAllList.length - 1].poundageFee
            } else {
              this.configList = []
              this.addRow('first', null)
            }
            this.radio1 = `${res.data.dividedType}`
            this.form.goodsCommissionRate = res.data.goodsCommissionRate
            this.form.operationCompanyId = res.data.operationCompanyId
            this.form.distributionCenterName = res.data.distributionCenterName
            this.form.distributionCenterPhone = res.data.distributionCenterPhone
            this.form.provinceCode = res.data.addressSaveData.provinceCode
            this.form.cityCode = res.data.addressSaveData.cityCode
            this.form.areaCode = res.data.addressSaveData.areaCode
            this.form.areaInfo = res.data.addressSaveData.areaInfo
            this.updateShowArea.provinceCode = res.data.addressSaveData.provinceCode
            this.updateShowArea.cityCode = res.data.addressSaveData.cityCode
            this.updateShowArea.areaCode = res.data.addressSaveData.areaCode
            resolve(res.data)
          }
        })
      })
    },
    inputLogistics () { // 代收手续费校验
      let newValue = this.form.goodsCommissionRate.toString().replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (newValue === '') {
        this.form.goodsCommissionRate = ''
      } else {
        if (newValue <= 100) {
          this.form.goodsCommissionRate = newValue
        } else {
          this.form.goodsCommissionRate = ''
        }
      }
    },
    addRow (type, data, index) { // 增行
      // this.endPrice = ''
      if (type === 'first') {
        this.configList = []
        let rowItemObj = {
          goodsStart: 0,
          goodsEnd: '',
          poundageFee: ''
        }
        this.configList.push(rowItemObj)
      }
      if (type === 'add') {
        this.endserviceCharge = ''
        if (data.goodsEnd > data.goodsStart) {
          let rowItemObj = {
            goodsStart: Number(data.goodsEnd),
            goodsEnd: '',
            poundageFee: ''
          }
          this.configList.push(rowItemObj)
        } else {
          this.$notify({
            message: '右侧货款金额需大于左侧！',
            type: 'error'
          })
          this.configList[index].goodsEnd = ''
          this.configList[index].poundageFee = ''
        }
      }
    },
    reduceRow (rowIndex) { // 减行
      this.endserviceCharge = ''
      this.configList = this.configList.filter((item, index) => {
        return rowIndex !== index
      })
    },
    insertDc (val) {
      DcManageAjax.InsertDc(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '新建成功',
            type: 'success'
          })
          this.$router.push({name: 'DcManage'})
        }
      })
    },
    updateDc (val) {
      DcManageAjax.UpdateDc(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({name: 'DcManage'})
        }
      })
    },
    save () { // 保存
      this.$refs.form.validate((valid) => {
        if (valid && !this.validForm()) {
          let postForm = {
            distributionCenterName: this.form.distributionCenterName, // 分拨中心名称
            operationCompanyId: this.form.operationCompanyId, // 运营公司
            distributionCenterPhone: this.form.distributionCenterPhone,
            dividedType: this.form.dividedType,
            goodsCommissionRate: this.form.goodsCommissionRate,
            goodsAllList: [],
            dcId: this.dcId,
            addressSaveData: this.form.addressSaveData
          }
          if (this.radio1 === '10') {
            postForm.goodsAllList = []
          } else {
            this.form.goodsCommissionRate = ''
            postForm.goodsAllList = this.configList.map(item => {
              let obj = {
                goodsStart: item.goodsStart,
                goodsEnd: item.goodsEnd,
                poundageFee: item.poundageFee
              }
              return obj
            })
            let endObj = {
              goodsStart: this.endPrice,
              goodsEnd: -1,
              poundageFee: this.endserviceCharge
            }
            postForm.goodsAllList.push(endObj)
          }
          if (this.pageType === 'add') {
            this.insertDc(postForm)
          }
          if (this.pageType === 'edit') {
            this.updateDc(postForm)
          }
        } else {
          this.$notify({
            message: '配置信息不完整，请完善后再保存',
            type: 'error'
          })
        }
      })
    },
    goBack () { // 返回
      this.$router.push({name: 'DcManage'})
    },
    keyupGoodsEnd (val, index, event) {
      this.configList[index].goodsEnd = val.toString().replace(/[^\d]/g, '')
      // let value = val.match(/^\d*(\.?\d{0,2})/g)[0] || null
      // this.$nextTick(() => {
      //   event.target.value = value
      //   this.configList[index].goodsEnd = value
      // })
    },
    keyupPoundageFee (val, index, event) {
      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 四位整数和俩位小数
        this.configList[index].poundageFee = val.match(/^\d{0,4}/g)[0] || null
      } else {
        this.configList[index].poundageFee = val.match(/^\d{0,4}(\.?\d{0,2})/g)[0] || null
      }
    },
    keyupLastPoundageFee (flag, val, indexVal, event) {
      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 四位整数和俩位小数
        this.endserviceCharge = val.match(/^\d{0,4}/g)[0] || null
      } else {
        this.endserviceCharge = val.match(/^\d{0,4}(\.?\d{0,2})/g)[0] || null
      }
    },
    validNum (flag, val, indexVal, event) { // 输入框校验
      if (flag === 'goodsEnd') {
        val = this.validateOnlyNum(val)
        this.$nextTick(() => {
          event.target.value = val
        })
      } else {
        if (val.indexOf('.') === -1) { // 没有点
          if (val.length > 5 || val.length === 5) {
            val = val.substr(0, 4)
          }
        } else {
          this.poundageFeeMax = 7
        }
        val = this.validateNumIncludePoint(val)
        // val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        // val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
        if (val.indexOf('.') < 0 && val !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          val = parseFloat(val)
        }
        this.$nextTick(() => {
          event.target.value = val
        })
      }
    },
    validForm () { // 信息完整校验
      if (this.radio1 === '10') {
        return this.form.goodsCommissionRate === ''
      } else {
        return this.configList.some(item => {
          return item.goodsStart === '' || item.goodsEnd === '' || item.poundageFee === ''
        }) || this.endserviceCharge === ''
      }
    },
    clickSure () {
    },
    clickCancel () {
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.create-dc{
  display: flex;
  flex: 1;
  .card_main{
    // padding: 20px 20px 40px 20px;
    .receiptMoney-top {
      width: 100%;
      height: 60px;
    }
    .receiptMoney{
      width: 100%;
      height: auto;
      .el-input {
        width: 80px!important;
      }
      .configRow {
        height: 34px;
        line-height: 34px;
        margin: 5px;
        span {
          font-size: 13px;
        }
        .leftText {
          width: 70px;
          display: inline-block;
        }
        .leftPrice {
          margin-right: 10px;
          width: 80px;
          display: inline-block;
          text-align: right
        }
        .rightName {
          margin-left: 10px;
          width: 100px;
          display: inline-block;
          text-align: right;
        }
        i {
          font-size: 20px;
        }
      }
    }
    .card_btn {
      margin: 0 40px 20px 40px;
      .search-btn-con {
        float: right;
      }
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.create-dc{
  .public_card {
    width: 100%;
  }
  .receiptMoney .el-form-item {
    margin: 0!important;
    .el-form-item__label {
      margin-top: -3px!important;
    }
  }
  .receiptMoney .el-form--inline .el-input__inner {
    width: 80px!important;
  }
  .addressDetail .el-input__inner {
     width: 530px !important;
  }
}
</style>
