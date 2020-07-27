<template>
  <el-dialog :before-close="closeFormDialog" class="receipt-confirm-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form :inline="false" class="demo-form-inline" label-width="80px">
        <el-form-item class="date-item" :label="firstLabel" prop="time">
          <span>{{receiptAmount}} 元</span>
        </el-form-item>
        <el-form-item :label='secondLabel'>
          <span>{{personName}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click.once="clickSure">{{sureText}}</el-button>
      <el-button @click="clickCancel">取消</el-button>
    </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'ReceiptConfirm',
  props: {
    width: {
      type: String,
      default: '400px'
    },
    title: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    },
    receiptAmount: {
      type: String,
      default: '0'
    },
    personName: {
      type: String,
      default: ''
    },
    firstLabel: {
      type: String,
      default: '当前收款金额：'
    },
    secondLabel: {
      type: String,
      default: '交款人：'
    },
    sureText: {
      type: String,
      default: '确认收款'
    }
  },
  data () {
    return {
      dialogVisibleSelf: this.dialogVisible
    }
  },
  methods: {
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure () {
      this.$emit('click-sure', 'sure')
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>
<style lang="less">
@import '../../../../style/base.less';
.receipt-confirm-dialog{
  .el-dialog__body{
    padding: 30px 40px;
    .el-form-item__label{
      width: 110px!important;
    }
  }
}
</style>
