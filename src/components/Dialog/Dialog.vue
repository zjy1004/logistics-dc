<template>
  <el-dialog class="common_remove_dialog" :close-on-press-escape="closeByEsc" :show-close="closeShow" :center="centerVal" :class="selfClass" :before-close="closeDialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div class="main-text">{{mainText}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main btn-wide-padding" @click="clickSure">{{sureBtn}}</el-button>
      <el-button v-if="showCancel" class="btn-wide-padding" @click="clickCancel">{{cancelBtn}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    closeByEsc: {
      type: Boolean,
      default: true
    },
    closeShow: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '475px'
    },
    cancelBtn: {
      type: String,
      default: '取消'
    },
    sureBtn: {
      type: String,
      default: '确定'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: false
    },
    mainText: {
      type: String,
      default: '确定执行此操作吗？'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    selfClose: {
      type: Boolean,
      default: false
    },
    centerVal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selfClass: this.className,
      dialogVisibleSelf: this.dialogVisible
    }
  },
  mounted () {
    document.addEventListener('keyup', this.dialogKeyEvent, true)
  },
  methods: {
    // 快捷键提交
    dialogKeyEvent (event) {
      if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) { // ctrl+enter

      } else if (event.keyCode === 13) { // enter确定
        this.$emit('click-sure', 'sure')
      }
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure () {
      this.$emit('click-sure', 'sure')
    },
    closeDialog (done) {
      if (this.selfClose) {
        this.$emit('self-close')
      } else {
        this.$emit('click-cancel', 'cancel')
        done()
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.dialogKeyEvent, true)
  }
}
</script>
<style lang="less">
.common_remove_dialog{
  .el-dialog__header{
    span{
      font-weight: bold;
    }
  }
  .el-dialog__body{
    padding: 47px 0px 38px;
  }
  .el-dialog__footer{
    padding: 0;
    padding-bottom: 30px;
  }
}
</style>

<style lang="less" scoped>
@import '../../style/base.less';
.main-text{
  text-align: center;
  white-space: pre-line;
  padding: 0 30px ;
}
</style>
