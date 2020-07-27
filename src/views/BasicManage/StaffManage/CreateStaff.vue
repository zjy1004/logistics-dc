<template>
  <div class="create-staff">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">员工管理</span></h3>
      <div class="card_main">
        <div class="card_con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="100px">
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">基础信息</span>
            </div>
            <div>
              <el-row>
                <el-col :span="23" :offset="1">
                  <el-form-item label="角色:" prop="roleIdList">
                    <el-checkbox-group v-model="form.roleIdList">
                      <el-checkbox :key="item.id" :label="item.id" :disabled="pageType === 'check'" v-for="item in roleOption">{{item.roleName}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="员工姓名:" prop="userName">
                    <el-input v-model="form.userName" :disabled="pageType === 'check'" placeholder="请输入员工姓名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" @keyup.native="validPhone" maxlength="11" :disabled="pageType === 'check'" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="登录账号:" prop="account">
                    <el-input v-model="form.account" @keyup.native="accountInput" :disabled="pageType === 'check' || pageType === 'edit'" placeholder="请输入登录账号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="分拨中心:" prop="dcId">
                    <el-select v-model="form.dcId" filterable :disabled="pageType === 'check'" placeholder="请选择分拨中心" clearable>
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
import StaffManageAjax from '@/api/BasicManage/StaffManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'

export default {
  name: 'CreateStaff',
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
      id: '',
      saveShow: true,
      roleOption: [],
      dcOptions: [],
      form: {
        roleIdList: [], // 角色
        account: '', // 登录账号
        userName: '', // 员工姓名
        dcId: '', // 分拨中心
        phone: '' // 联系电话
      },
      rules: {
        account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        roleIdList: [{ required: true, message: '请选择角色', trigger: 'change' }],
        dcId: [{ required: true, message: '请选择分拨中心', trigger: 'change' }]
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
      let id = this.$route.query.id
      if (id) {
        this.id = id
      }
      if (this.pageType === 'add') {
      }
      if (this.pageType === 'check') {
        this.saveShow = false
        this.queryStaffInfo(id)
      }
      if (this.pageType === 'edit') {
        this.queryStaffInfo(id)
      }
      this.queryRoleDcList()
      this.queryRoleList()
    },
    validPhone (evnet, value) {
      this.form.phone = this.validateNum(this.form.phone)
    },
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
    },
    queryRoleList () { // 查询分拨中心list
      StaffManageAjax.QueryRoleDcList().then(res => {
        if (res.code === 200) {
          this.roleOption = res.data
        }
      })
    },
    queryRoleDcList () { // 查询角色下分拨中心list
      BasicCommonAjax.QueryRoleDcList().then(res => {
        if (res.code === 200) {
          this.dcOptions = res.data
          if (res.data && res.data.length === 1) {
            this.form.dcId = res.data[0].id
          }
        }
      })
    },
    validPhoneAjax () {
      return new Promise((resolve, reject) => {
        BasicCommonAjax.ValidStaffPhone({dcId: this.form.dcId, phone: this.form.phone, personId: this.id}).then(res => {
          if (res.code === 200) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      })
    },
    queryStaffInfo (val) {
      StaffManageAjax.QueryStaffInfo({personnelId: val}).then(res => {
        if (res.code === 200) {
          this.form.roleIdList = res.data.roleIdList
          this.form.account = res.data.account
          this.form.userName = res.data.userName
          this.form.dcId = res.data.dcId
          this.form.phone = res.data.phone
        }
      })
    },
    insertStaff (val) {
      StaffManageAjax.InsertStaff(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '新建成功',
            type: 'success'
          })
          this.$router.push({name: 'StaffManage'})
        }
      })
    },
    updateStaff (val) {
      StaffManageAjax.UpdateStaff(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({name: 'StaffManage'})
        }
      })
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validPhoneAjax().then(res => {
            if (!res) {
              if (this.pageType === 'add') {
                this.validAccount(this.form.account).then(res => {
                  if (res) {
                    this.$notify({
                      message: '账号已存在，请重新输入',
                      type: 'error'
                    })
                  } else {
                    this.insertStaff(this.form)
                  }
                })
              }
              if (this.pageType === 'edit') {
                this.form.personnelId = this.id
                this.updateStaff(this.form)
              }
            }
          })
        } else {
          return false
        }
      })
    },
    validAccount (val) {
      return new Promise((resolve, reject) => {
        BasicCommonAjax.ValidAccount({account: val}).then(res => {
          if (res.code === 200) {
            resolve(res.data)
          }
        })
      })
    },
    goBack () { // 返回
      this.$router.push({name: 'StaffManage'})
    }
  }
}
</script>

<style lang="less" scoped>
.create-staff {
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
.create-staff {
}
</style>
