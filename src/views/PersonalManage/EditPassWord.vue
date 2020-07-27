<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div class="main-text">
      <el-form ref="form" :rules="rules" :model="form" class="username-tbody" label-width="120px">
        <el-form-item label="原密码:" prop="oldPass">
          <el-input type="password" v-model="form.oldPass" placeholder="请输入原密码" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPass">
          <el-input type="password" v-model="form.newPass" maxlength="128" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="selfPass">
          <el-input type="password" v-model="form.selfPass" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="editPassWord('form')">保存</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-wide-padding" @click="clickCancel">取消</el-button>
      <el-button class="btn-main btn-wide-padding" @click="editPassWord('form')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import PersonalManageAjax from '@/api/PersonalManage/PersonalManage'
import PersonalManageAjax from '@/api/PersonalManage/PersonalManage'

export default {
  props: {
    width: {
      type: String,
      default: '475px'
    },
    title: {
      type: String,
      default: '修改密码'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        newPass: '',
        oldPass: ''
      },
      rules: {
        oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPass: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
        selfPass: [{ required: true, message: '请输入确认密码', trigger: 'blur' }, { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  watch: {
    $route (newVal, oldVal) {

    }
  },
  created () {

  },
  methods: {
    editPassWord (val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.selfPass !== this.form.newPass) {
            this.$notify({
              message: '两次密码输入不一致！',
              type: 'error'
            })
          } else {
            this.updatePsw(this.form)
          }
        }
      })
    },
    updatePsw (val) {
      PersonalManageAjax.UpdatePsd(val).then(res => {
        if (res.code === 200) {
          this.$emit('click-cancel', 'cancel')
          this.$notify({
            message: '密码修改成功！,请重新登录',
            type: 'success'
          })
          setTimeout(() => {
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('userInfo')
            this.$router.push({path: '/'})
          }, 1000)
        }
      })
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    }
  },
  components: {

  }
}
</script>

<style lang="less">
@import '../../style/base.less';

</style>

<style lang="less" scoped>
@import '../../style/base.less';

</style>
