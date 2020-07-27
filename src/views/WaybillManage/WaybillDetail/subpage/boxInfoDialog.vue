<template>
  <el-dialog :before-close="closeFormDialog" class="boxInfo form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div class="info-wrap">
      <el-checkbox-group v-model="boxCheckList">
        <el-checkbox :label="checkItem.boxId" :key="index" v-for="(checkItem,index) in checkGroup">{{checkItem.boxNumber}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure">确定</el-button>
        <el-button @click="clickCancel">取消</el-button>
    </div>
    </el-dialog>
</template>

<script>
import WaybillAjax from '@/api/WaybillManage/WaybillManage'

export default {
  name: 'DialogForm',
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
    waybillId: { // 运单id
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      boxCheckList: [],
      checkGroup: [],
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    this.queryBoxInfo(this.waybillId)
  },
  methods: {
    queryBoxInfo (val) { // 箱单信息
      WaybillAjax.QueryBoxInfo({waybillId: val}).then(res => {
        if (res.code === 200) {
          this.checkGroup = res.data
          this.boxCheckList = this.checkGroup.map(item => {
            return item.boxId
          })
        }
      })
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure () {
      this.$emit('click-sure', this.boxCheckList)
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>

<style lang="less">
.boxInfo {
  .info-wrap {
    height: 200px;
    overflow-y: auto;
  }
  .el-date-editor{
      width: 245px;
  }
  .el-dialog{
    .el-dialog__body{
      padding: 20px 40px;
      .info-wrap {
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
          .el-checkbox {
            margin-left: 30px;
          }
        }
      }
    }
  }
}
</style>
