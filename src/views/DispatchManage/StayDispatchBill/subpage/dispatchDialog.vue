<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :center="true" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div class="dispatchDialog">
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="100px">
        <el-form-item label="线路名称:" prop="lineId">
          <el-select v-model="form.lineId" filterable placeholder="请选择线路" clearable>
            <el-option
              v-for="(item, index) in lineOptions"
              :key="index"
              :label="item.lineName"
              :value="item.lineId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">确认</el-button>
        <el-button @click="clickCancel">取消</el-button>
    </div>
    </el-dialog>
</template>

<script>
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
    lineOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      form: {
        lineId: ''
      },
      rules: {
        lineId: [{ required: true, message: '线路不能为空', trigger: 'change' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {

  },
  watch: {

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
</style>
