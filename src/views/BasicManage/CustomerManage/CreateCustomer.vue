<template>
  <div class="create-customer">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">客户管理</span></h3>
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
                  <el-form-item label="客户名称:" prop="clientName">
                    <el-input v-model="form.clientName" :disabled="pageType === 'check'" placeholder="请输入客户名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系人:" prop="userName">
                    <el-input v-model="form.userName" :disabled="pageType === 'check'" placeholder="请输入联系人"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" @keyup.native="validPhone" maxlength="11" :disabled="pageType === 'check'" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="分拨中心:" prop="dcId">
                    <el-select v-model="form.dcId" filterable :disabled="pageType === 'check'" @change="dcChange" placeholder="请选择分拨中心" clearable>
                      <el-option
                        v-for="(item, index) in dcOptions"
                        :key="index"
                        :label="item.dcName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="配送线路:" prop="lineId">
                    <el-select v-model="form.lineId" :disabled="pageType === 'check'" placeholder="请选择配送线路" clearable>
                      <el-option
                        v-for="(item, index) in deliveryOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="客户角色:" prop="clientType">
                    <el-radio-group :disabled="pageType === 'check'" v-model="form.clientType">
                      <el-radio :label="10">维修终端</el-radio>
                      <el-radio :label="20">配件商</el-radio>
                    </el-radio-group>
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
              <!-- <el-row>
                <el-col :span="23" :offset="1">
                  <el-form-item label="" prop="areaInfo">
                    <el-input class="addressDetail" v-model="form.areaInfo" :disabled="pageType === 'check'" placeholder="请输入详细经营地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
            </div>
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">账户信息</span>
            </div>
            <div class="info">
              <el-row>
                <!-- <el-col :span="6" :offset="1">
                  <el-form-item label="客户ID:">&emsp;自动生成，不可修改</el-form-item>
                </el-col> -->
                <el-col :span="6" :offset="1">
                  <el-form-item label="登录账号:" prop="">
                    <el-input v-model="form.account" @keyup.native="accountInput" :disabled="pageType === 'check' || (pageType === 'edit' && accountDisabled)" placeholder="请输入登录账号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">业务信息</span>
            </div>
            <div class="">
              <el-row>
                <el-col :span="23" :offset="1">
                  <el-form-item label="运费结算方式:" prop="freightSettlementMethod">
                    <el-radio-group :disabled="pageType === 'check'" v-model="form.freightSettlementMethod">
                      <el-radio :label="1">现结</el-radio>
                      <el-radio :label="2">月结</el-radio>
                      <el-radio :label="3">包月</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
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
  </div>
</template>

<script>
import CustomerManageAjax from '@/api/BasicManage/CustomerManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'

export default {
  name: 'CreateCustomer',
  data () {
    // let validatePhoneNum = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入联系电话！'))
    //   } else if (!this.isvalidPhone(value)) {
    //     callback(new Error('请输入正确的联系电话！'))
    //   } else if (this.hasPhone) {
    //     callback(new Error('联系电话已存在！'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      saveRoleType: '',
      id: '',
      saveShow: true,
      accountDisabled: true,
      dcOptions: [],
      deliveryOptions: [],
      configList: [],
      radio1: '1', // 单选val
      poundageFeeMax: 5,
      form: {
        clientName: '', // 客户名称
        userName: '', // 联系人
        phone: '', // 联系电话
        dcId: '', // 分拨中心
        lineId: '', // 配送线路
        clientType: 10, // 客户角色
        addressSaveData: { // 经营地址
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          areaInfo: ''
        },
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        areaInfo: '',
        account: '', // 登录账号
        freightSettlementMethod: 1 // 运费结算方式
      },
      updateShowArea: {
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      areaPList: [], // 省
      areaCList: [], // 市
      areaQList: [], // 区
      rules: {
        clientName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        dcId: [{ required: true, message: '请选择分拨中心', trigger: 'change' }],
        lineId: [{ required: true, message: '请选择配送路线', trigger: 'change' }],
        clientType: [{ required: true, message: '请选择客户角色', trigger: 'change' }],
        // phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
        provinceCode: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityCode: [{ required: true, message: '请选择市', trigger: 'change' }],
        areaCode: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入详细经营地址（如街道门牌号）', trigger: 'blur' }],
        account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        freightSettlementMethod: [{ required: true, message: '请选择运费结算方式', trigger: 'change' }]
      }
    }
  },
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo) {
      this.saveRoleType = userInfo.accountType
    }
    this.init()
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
    pageType () {
      return this.$route.query.type
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
        this.queryAreaList({areaParentCode: newVal}, 'city')
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
        this.queryAreaList({areaParentCode: newVal}, 'area')
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
    }
  },
  methods: {
    init () {
      let id = this.$route.query.id
      if (id) {
        this.id = id
      }
      if (this.pageType === 'add') {
        this.queryAreaList({areaParentCode: 0}, 'province')
      }
      if (this.pageType === 'check') {
        this.updateInit(id)
        this.saveShow = false
      }
      if (this.pageType === 'edit') {
        this.updateInit(id)
      }
      this.queryRoleDcList()
    },
    validPhone (evnet, value) {
      this.form.phone = this.validateNum(this.form.phone)
    },
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
    },
    validPhoneAjax () {
      return new Promise((resolve, reject) => {
        BasicCommonAjax.ValidClientPhone({dcId: this.form.dcId, phone: this.form.phone, clientId: this.id}).then(res => {
          if (res.code === 200) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      })
    },
    queryAreaList (val, flag) { // 省市
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
    queryRoleDcList () { // 查询角色下分拨中心list
      BasicCommonAjax.QueryRoleDcList().then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
          if (res.data && res.data.length === 1) {
            this.form.dcId = res.data[0].id
            if (this.pageType === 'add') {
              this.dcChange(res.data[0].id)
            }
          }
        }
      })
    },
    dcChange (val, detailVal) { // 查询分拨中心下线路list
      BasicCommonAjax.QueryDcLineList({dcId: val}).then(res => {
        if (res.code === 200) {
          this.deliveryOptions = res.data
          if (detailVal) {
            this.form.lineId = detailVal
          } else {
            this.form.lineId = ''
          }
        }
      })
    },
    updateInit (id) {
      init.bind(this)(id)
      async function init (id) {
        await this.queryCustomerInfo(id)
        this.queryAreaList({areaParentCode: 0}, 'province')
        this.queryAreaList({areaParentCode: this.updateShowArea.provinceCode}, 'city')
        this.queryAreaList({areaParentCode: this.updateShowArea.cityCode}, 'area')
      }
    },
    async queryCustomerInfo (id) { // 分拨中心回显
      return new Promise((resolve, reject) => {
        CustomerManageAjax.QueryCustomerInfo({id: id}).then(res => {
          if (res.code === 200) {
            if (res.data.account === '' || res.data.account === null) {
              this.accountDisabled = false
            }
            if (res.data.dcId) {
              this.dcChange(res.data.dcId, res.data.lineId)
            }
            this.form.clientName = res.data.clientName
            this.form.userName = res.data.userName
            this.form.phone = res.data.phone
            this.form.dcId = res.data.dcId
            // this.form.lineId = res.data.lineId
            this.form.clientType = res.data.clientType
            this.form.account = res.data.account
            this.form.freightSettlementMethod = res.data.freightSettlementMethod
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
    insertCustomer (val) {
      CustomerManageAjax.InsertCustomer(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '新建成功',
            type: 'success'
          })
          this.$router.push({name: 'CustomerManage'})
        }
      })
    },
    updateCustomer (val) {
      CustomerManageAjax.UpdateCustomer(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({name: 'CustomerManage'})
        }
      })
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postForm = {
            clientName: this.form.clientName,
            userName: this.form.userName,
            phone: this.form.phone,
            dcId: this.form.dcId,
            lineId: this.form.lineId,
            clientType: this.form.clientType,
            addressSaveData: this.form.addressSaveData,
            account: this.form.account,
            freightSettlementMethod: this.form.freightSettlementMethod
          }
          this.validPhoneAjax().then(res => {
            if (!res) {
              if (this.pageType === 'add') {
                this.insertCustomer(postForm)
              }
              if (this.pageType === 'edit') {
                postForm.clientId = this.id
                this.updateCustomer(postForm)
              }
            }
          })
        }
      })
    },
    goBack () { // 返回
      this.$router.push({name: 'CustomerManage'})
    }
  }
}
</script>

<style lang="less" scoped>
.create-customer {
  display: flex;
  flex: 1;
  overflow: auto;
  .info {
    margin-bottom: 30px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>

<style lang="less">
.create-customer {
  .addressDetail .el-input__inner {
     width: 530px !important;
  }
}
</style>
