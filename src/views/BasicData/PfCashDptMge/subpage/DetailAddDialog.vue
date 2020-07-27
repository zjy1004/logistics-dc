<template>
  <el-dialog :before-close="closeFormDialog" class="detail-add-dialog form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="保证金余额:" prop="">
          {{marginVal}}
        </el-form-item>
        <el-form-item label="添加类型:" prop="operateType">
          <el-radio-group v-model="form.operateType">
            <el-radio :disabled="operateDisabled" :label="2">保证金扣减</el-radio>
            <el-radio :label="1">保证金充值</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额:" prop="amount">
          <el-input v-model="form.amount" maxlength="7"  placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item class="remark" label="备注:" prop="remark">
          <el-input type="textarea" :rows="2" v-model="form.remark" maxlength="128"  placeholder="备注说明"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">确认</el-button>
        <el-button @click="clickCancel">返回</el-button>
    </div>
    </el-dialog>
</template>

<script>
// import CashDptMgeAjax from '@/api/FinanceManage/CashDptMge/CashDptMge'

export default {
  name: 'DetailAddDialog',
  props: {
    width: {
      type: String,
      default: '40%'
    },
    title: {
      type: String,
      default: '标准弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    },
    marginVal: {
      type: Number,
      default: 0
    },
    marginId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      margin: 0,
      operateDisabled: true,
      form: {
        marginId: this.marginId,
        operateType: 1, // 操作类型
        amount: '', // 金额
        remark: '' // 备注
      },
      rules: {
        tcType: [{ required: true, message: '请选择组织关系', trigger: 'change' }],
        tcId: [{ required: true, message: '请选择运力', trigger: 'change' }],
        operateType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    this.margin = this.marginVal
  },
  watch: {
    margin (newVal, oldVal) {
      if (newVal === 0) {
        this.operateDisabled = true
      } else {
        this.operateDisabled = false
      }
    }
  },
  methods: {
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$emit('click-sure', this.form)
        }
      })
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>

<style lang="less">
.detail-add-dialog {
  .el-date-editor{
      width: 245px;
  }
  .el-dialog{
    .el-dialog__body{
      .el-form-item{
        .el-form-item__label{
          width: 120px!important;
        }
      }
      .remark {
        .el-textarea {
          width: 246px;
        }
      }
    }
  }
}
</style>
