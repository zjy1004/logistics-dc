<template>
  <div class="create-logistics">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">物流公司管理</span></h3>
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
                  <el-form-item label="登录账号:" prop="loginAccount">
                    <el-input v-model="form.loginAccount" @keyup.native="accountInput" :disabled="pageType === 'check' || pageType === 'edit'" placeholder="请输入登录账号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="物流公司简称:" prop="companyAbbreviation">
                    <el-input v-model="form.companyAbbreviation" :disabled="pageType === 'check'" placeholder="请输入物流公司简称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="物流公司全称:" prop="companyName">
                    <el-input v-model="form.companyName" :disabled="pageType === 'check'" placeholder="请输入物流公司全称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
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
              <span class="title">运力信息</span>
            </div>
            <div v-if="pageType !== 'add'" class="tab_wrap">
              <el-table
                :data="trsTabData"
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
                  prop="userName"
                  label="联系人">
                </el-table-column>
                <el-table-column
                  min-width="15%"
                  prop="phone"
                  label="联系电话">
                </el-table-column>
                <el-table-column
                  min-width="15%"
                  prop="account"
                  label="登录账号">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="100px">
                  <template slot-scope="scope">
                    <a class="check" href="javascript:;" type="text" size="small" @click="chenckTransport(scope.row)">查看</a>
                  </template>
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
import LogisticsManageAjax from '@/api/BasicManage/LogisticsManage'
// import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
export default {
  name: 'CreateLogistics',
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
      logisticsId: '',
      saveShow: true,
      form: {
        loginAccount: '', // 登录账号
        companyAbbreviation: '', // 物流公司简称
        companyName: '', // 物流公司全称
        userName: '', // 联系人
        phone: '' // 联系电话
      },
      trsTabData: [
        {rowNum: 1, user: '运力1', phone: '11111', loginAccount: 't1'},
        {rowNum: 2, user: '运力2', phone: '22222', loginAccount: 't2'},
        {rowNum: 3, user: '运力3', phone: '33333', loginAccount: 't3'}
      ],
      rules: {
        loginAccount: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        companyAbbreviation: [{ required: true, message: '请输入物流公司简称', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入物流公司全称', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
        // phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    pageType () {
      return this.$route.query.type
    }
  },
  watch: {
  },
  methods: {
    init () {
      let logisticsId = this.$route.query.id
      if (logisticsId) {
        this.logisticsId = logisticsId
      }
      if (this.pageType === 'add') {
      }
      if (this.pageType === 'check') {
        this.queryLogisticsInfo(logisticsId)
        this.saveShow = false
      }
      if (this.pageType === 'edit') {
        this.queryLogisticsInfo(logisticsId)
      }
    },
    validPhone (evnet, value) {
      this.form.phone = this.validateNum(this.form.phone)
    },
    accountInput () {
      this.form.loginAccount = this.validateAccount(this.form.loginAccount)
    },
    queryLogisticsInfo (id) { // 分拨中心回显
      LogisticsManageAjax.QueryLogisticsInfo({logisticsId: id}).then(res => {
        if (res.code === 200) {
          this.form.loginAccount = res.data.loginAccount
          this.form.companyAbbreviation = res.data.companyAbbreviation
          this.form.companyName = res.data.companyName
          this.form.userName = res.data.userName
          this.form.phone = res.data.phone
          this.trsTabData = res.data.dcCompanyTransportCapacityPartVoList.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
        }
      })
    },
    insertLogistics (val) { // 新建物流公司
      LogisticsManageAjax.InsertLogistics(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '新建成功',
            type: 'success'
          })
          this.$router.push({name: 'LogisticsManage'})
        }
      })
    },
    updateLogistics (val) { // 修改物流公司
      LogisticsManageAjax.UpdateLogistics(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({name: 'LogisticsManage'})
        }
      })
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postForm = {
            loginAccount: this.form.loginAccount,
            companyAbbreviation: this.form.companyAbbreviation,
            companyName: this.form.companyName,
            userName: this.form.userName,
            phone: this.form.phone,
            dcAddress: this.form.dcAddress
          }
          if (this.pageType === 'add') { // 新建
            this.insertLogistics(postForm)
          }
          if (this.pageType === 'edit') { // 修改
            postForm.companyId = this.logisticsId
            this.updateLogistics(postForm)
          }
        }
      })
    },
    chenckTransport (row) { // 查看运力
      this.$router.push({name: 'CreateTransport', query: {type: 'check', id: row.id}})
    },
    goBack () { // 返回
      this.$router.push({name: 'LogisticsManage'})
    }
  }
}
</script>

<style lang="less" scoped>
.create-logistics {
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
.create-logistics {
  .addressDetail .el-input__inner {
     width: 400px !important;
  }
}
</style>
