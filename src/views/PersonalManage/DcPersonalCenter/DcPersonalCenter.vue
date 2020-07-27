<template>
  <div class="dc-personal-center">
    <div class="public_card">
      <h3 class="detail_header">分拨中心 / <span class="currentDetail">个人中心</span></h3>
      <div class="card_main">
        <div class="card_con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="120px">
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">基础信息</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系人:" prop="">
                    {{userName}}
                  </el-form-item>
                </el-col>
                 <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="">
                    {{phone}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="登录账号:" prop="">
                    {{account}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="职务:" prop="">
                    {{roleName}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="所属公司:" prop="">
                    {{operateName}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="23" :offset="1">
                  <el-form-item label="分拨中心:" prop="">
                    {{dcName}}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <!-- <div class="card_btn">
          <div class="search-btn-con">
            <el-button class="btn-main" @click="save('form')">保存</el-button>
            <el-button class="btn-main" @click="goBack()">返回</el-button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import PersonalManageAjax from '@/api/PersonalManage/PersonalManage'

export default {
  name: 'DcPersonalCenter',
  data () {
    return {
      account: '',
      dcName: '',
      operateName: '',
      phone: '',
      roleName: '',
      userName: '',
      form: {},
      rules: {}
    }
  },
  computed: {
  },
  created () {
    this.getDcInfo()
  },
  watch: {
  },
  methods: {
    init () {
    },
    getDcInfo (val) { // 分拨中心个人信息
      PersonalManageAjax.GetDcPersonalInfo().then(res => {
        if (res.code === 200) {
          this.account = res.data.account
          this.dcName = res.data.dcName
          this.operateName = res.data.operateName
          this.phone = res.data.phone
          this.roleName = res.data.roleName
          this.userName = res.data.userName
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
.dc-personal-center {
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
.dc-personal-center {
}
</style>
