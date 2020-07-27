<template>
  <div class="create-transport">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">运力管理</span></h3>
      <div class="card_main">
        <div class="card_con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="100px">
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">基础信息</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="登录账号:" prop="account">
                    <el-input v-model="form.account" @keyup.native="accountInput" :disabled="pageType === 'check' || pageType === 'edit'" placeholder="请输入登录账号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系人:" prop="userName">
                    <el-input v-model="form.userName" :disabled="pageType === 'check'" placeholder="请输入联系人"></el-input>
                  </el-form-item>
                </el-col>
                 <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" :disabled="pageType === 'check'" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="组织关系:" prop="scale">
                    <el-radio-group :disabled="pageType === 'check'" v-model="form.scale">
                      <el-radio :label="1">个人</el-radio>
                      <el-radio :label="2">物流公司</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="关联物流:" prop="logisticsName" v-if="!logisticsDisabled">
                    <el-select v-model="form.logisticsName" filterable :disabled="pageType === 'check' || logisticsDisabled" placeholder="请选择关联物流" clearable>
                      <el-option
                        v-for="(item, index) in logisticsList"
                        :key="index"
                        :label="item.companyAbbreviation"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="关联物流:" prop="" v-if="logisticsDisabled">
                    <el-select v-model="form.logisticsName" filterable :disabled="pageType === 'check' || logisticsDisabled" placeholder="请选择关联物流" clearable>
                      <el-option
                        v-for="(item, index) in logisticsList"
                        :key="index"
                        :label="item.companyAbbreviation"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="配送类型:" prop="deliveryTypeList">
                    <el-checkbox-group v-model="form.deliveryTypeList" :disabled="pageType === 'check'">
                      <el-checkbox label=10 name="type">配送线路</el-checkbox>
                      <el-checkbox label=20 name="type">专线</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">保证金</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="保证金:" prop="cashDeposit ">
                    <el-input v-model="form.cashDeposit" placeholder="请输入保证金"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div> -->
            <div v-if="pageType !== 'add'" class="card_form_title">
              <span class="title_line"></span>
              <span class="title">线路信息</span>
            </div>
            <div v-if="pageType !== 'add'" class="tab_wrap">
              <el-table
                :data="lineTabData"
                style="width: 100%"
                stripe
                border>
                <el-table-column
                  min-width="5%"
                  prop="rowNum"
                  label="序号">
                </el-table-column>
                <el-table-column
                  min-width="10%"
                  prop="lineName"
                  label="线路">
                </el-table-column>
                <el-table-column
                  min-width="20%"
                  prop="shiftName"
                  label="班次">
                </el-table-column>
              </el-table>
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
import TransportManageAjax from '@/api/BasicManage/TransportManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'

export default {
  name: 'CreateTransport',
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
      logisticsDisabled: false,
      saveShow: true,
      id: '',
      form: {
        account: '', // 登录账号
        userName: '', // 联系人
        phone: '', // 联系电话
        logisticsName: '', // 关联物流
        scale: '', // 规模
        deliveryTypeList: [] // 配送类型
      },
      logisticsList: [],
      lineTabData: [],
      rules: {
        account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        deliveryTypeList: [{ required: true, message: '请选择配送类型', trigger: 'change' }],
        logisticsName: [{ required: true, message: '请选择关联物流', trigger: 'change' }],
        scale: [{ required: true, message: '请选择组织关系', trigger: 'change' }]
        // phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
      }
    }
  },
  computed: {
    pageType () {
      return this.$route.query.type
    },
    scale () {
      return this.form.scale
    }
  },
  created () {
    this.queryLogistics()
    this.init()
  },
  watch: {
    scale (newVal, oldVal) {
      if (newVal === 1) {
        this.logisticsDisabled = true
        this.form.logisticsName = ''
      } else {
        this.logisticsDisabled = false
      }
    }
  },
  methods: {
    init () {
      let id = this.$route.query.id
      if (id) {
        this.id = id
      }
      if (this.pageType === 'check') {
        this.queryTransportInfo(id)
        this.saveShow = false
      }
      if (this.pageType === 'edit') {
        this.queryTransportInfo(id)
      }
    },
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
    },
    queryLogistics () { // 查询关联物流list
      BasicCommonAjax.QueryLogisticsList().then(res => {
        if (res.code === 200) {
          this.logisticsList = res.data
        }
      })
    },
    queryTransportInfo (val) { // 运力信息回显
      TransportManageAjax.QueryTransportInfo({id: val}).then(res => {
        if (res.code === 200) {
          this.form.account = res.data.account
          this.form.userName = res.data.userName
          this.form.phone = res.data.phone
          this.form.logisticsName = res.data.logisticsName
          this.form.scale = res.data.scale
          this.form.accountId = res.data.accountId
          this.lineTabData = res.data.lineAndShiftList.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
          if (res.data.deliveryType === 30) {
            this.form.deliveryTypeList = ['10', '20']
          } else {
            this.form.deliveryTypeList = [`${res.data.deliveryType}`]
          }
        }
      })
    },
    insertTransport (val) { // 新建运力
      TransportManageAjax.InsertTransport(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '新建成功',
            type: 'success'
          })
          this.$router.push({name: 'TransportManage'})
        }
      })
    },
    updateTransportInfo (val) { // 修改运力
      TransportManageAjax.UpdateTransport(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({name: 'TransportManage'})
        }
      })
    },
    goBack () { // 返回
      this.$router.push({name: 'TransportManage'})
    },
    save (formName) { // 保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pageType === 'add') {
            this.insertTransport(this.form)
          }
          if (this.pageType === 'edit') {
            this.form.transportCapacityId = this.id
            this.updateTransportInfo(this.form)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.create-transport {
  display: flex;
  flex: 1;
  overflow: auto;
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>

<style lang="less">
.create-transport {
}
</style>
