<template>
  <el-dialog :before-close="closeFormDialog" class="creatShiftPlan form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="线路类型:" prop="lineType">
          <el-select v-model="form.lineType" :disabled="isEdit" placeholder="请选择线路类型" @change="selectLineType(form.lineType, 'add')">
            <el-option
              v-for="(item, index) in lineTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路:" prop="lineId">
          <el-select v-model="form.lineId" :disabled="isEdit" placeholder="请选择线路" @change="changeLine(form.lineId)">
            <el-option
              v-for="(item, index) in lineOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次:" prop="shiftName">
          <el-input v-model="form.shiftName" :disabled="isEdit" maxlength="7"  placeholder="请输入班次"></el-input>
        </el-form-item>
        <el-form-item label="运力:" prop="tcId">
          <el-select v-model="form.tcId" placeholder="请选择运力" @change="changeTc(form.tcId)">
            <el-option
              v-for="(item, index) in tcOptionsArr"
              :key="index"
              :label="item.userName"
              :value="item.transportCapacityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" disabled  placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">保存</el-button>
        <el-button @click="clickCancel">返回</el-button>
    </div>
    </el-dialog>
</template>

<script>
import ShiftPlanAjax from '@/api/DispatchManage/ShiftPlanManage'

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
    lineNameOptionsArr: {
      type: Array,
      default: () => ([])
    },
    addFlagProps: {
      type: String,
      default: ''
    },
    editObjProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isEdit: false, // 是否是编辑态
      form: {
        lineType: '', // 线路类型
        tcId: '', // 运力
        lineId: '', // 所属线路
        shiftName: '', // 班次日期
        phone: ''
      },
      rules: {
        lineType: [{ required: true, message: '请选择线路类型', trigger: 'change' }],
        lineId: [{ required: true, message: '请选择线路', trigger: 'change' }],
        shiftName: [{ required: true, message: '请输入班次', trigger: 'blur' }],
        tcId: [{ required: true, message: '请选择运力', trigger: 'change' }]
      },
      lineTypeOptions: [{id: 10, name: '配送线路'}, {id: 20, name: '专线线路'}],
      lineOptions: [],
      dialogVisibleSelf: this.dialogVisible,
      tcOptionsArr: []
    }
  },
  created () {
    // let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.queryTcList()
    if (this.addFlagProps === 'edit') {
      this.isEdit = true
      this.form.id = this.editObjProps.id
      this.form.lineType = this.editObjProps.lineType
      this.form.lineId = this.editObjProps.lineId
      this.form.tcId = Number(this.editObjProps.tcId)
      this.form.shiftName = this.editObjProps.shiftName
      this.form.phone = this.editObjProps.phone
      if (this.form.lineType) {
        this.queryLineList(this.form.lineType, 'edit')
        this.queryTcList(this.form.lineType, 'edit')
      }
    } else {
      this.isEdit = false
    }
  },
  methods: {
    queryTcList (val) { // 运力列表
      ShiftPlanAjax.QueryTranspList({deliveryType: val}).then(res => {
        if (res.code === 200) {
          this.tcOptionsArr = res.data
        }
      })
    },
    queryLineList (val) { // 线路列表
      ShiftPlanAjax.QueryLineList({lineType: val}).then(res => {
        if (res.code === 200) {
          this.lineOptions = res.data
        }
      })
    },
    selectLineType (lineType, type) {
      if (type === 'add') {
        this.form.lineId = ''
        this.form.tcId = ''
      }
      this.queryLineList(lineType)
      this.queryTcList(lineType)
    },
    changeLine (val, type) {
    },
    changeTc (row) {
      this.tcOptionsArr.forEach(element => {
        if (row === element.transportCapacityId) {
          this.form.phone = element.phone
        }
      })
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.addFlagProps === 'edit') {
            // this.form.shiftId = this.editObjProps.shiftId
          }
          this.$emit('click-sure', this.form, this.addFlagProps)
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
.creatShiftPlan {
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
    }
  }
}
</style>
