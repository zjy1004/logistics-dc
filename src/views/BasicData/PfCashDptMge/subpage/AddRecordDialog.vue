<template>
  <el-dialog :before-close="closeFormDialog" class="add-record-dialog form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="组织关系:" prop="tcType">
          <el-radio-group v-model="form.tcType">
            <el-radio :label="1">个人</el-radio>
            <el-radio :label="2">物流公司</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!logisticsShow" label="运力名称:" prop="tcId">
          <el-select
            v-model.number="form.tcId"
            placeholder="请选择运力"
            @change="tcChange"
            remote
            reserve-keyword
            :remote-method="searchTrans"
            :loading="loading"
            filterable>
            <el-option
              v-for="(item, index) in trsOption"
              :key="index"
              :label="item.userName"
              :value="item.transportCapacityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="logisticsShow" label="物流公司:" prop="companyId">
          <el-select v-model.number="form.companyId" @change="logisticChange" placeholder="请选择物流公司" clearable>
            <el-option
              v-for="(item, index) in logisticsOption"
              :key="index"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保证金余额:" prop="">
          {{form.balance}}
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
import CashDptMgeAjax from '@/api/FinanceManage/CashDptMge/CashDptMge'

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
    }
  },
  data () {
    return {
      loading: false,
      logisticsShow: false,
      operateDisabled: true,
      tcName: '',
      form: {
        tcType: 1, // 组织关系
        companyId: '',
        tcId: '', // 运力id
        balance: 0, // 保证金余额
        operateType: 1, // 操作类型
        amount: '', // 金额
        remark: '' // 备注
      },
      trsOption: [],
      logisticsOption: [],
      rules: {
        tcType: [{ required: true, message: '请选择组织关系', trigger: 'change' }],
        tcId: [{ required: true, message: '请选择运力', trigger: 'change' }],
        operateType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        companyId: [{ required: true, message: '请选择物流公司', trigger: 'change' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  computed: {
    tcType () {
      return this.form.tcType
    },
    balance () {
      return this.form.balance
    }
  },
  watch: {
    tcType (newVal, oldVal) {
      if (newVal === 1) {
        this.logisticsShow = false
        this.form.companyId = ''
        this.form.balance = 0
      } else {
        this.logisticsShow = true
        this.form.tcId = ''
        this.form.balance = 0
      }
    },
    balance (newVal, oldVal) {
      if (newVal === 0) {
        this.operateDisabled = true
      } else {
        this.operateDisabled = false
      }
    }
  },
  created () {
    this.getTrans(this.tcName)
    this.getLogistics()
  },
  methods: {
    getTrans (val) { // 查询运力
      CashDptMgeAjax.GetTrans({tcName: val}).then(res => {
        if (res.code === 200) {
          this.trsOption = res.data
          this.loading = false
        }
      })
    },
    getLogistics (val) { // 查询物流公司
      CashDptMgeAjax.GetLogistics().then(res => {
        if (res.code === 200) {
          this.logisticsOption = res.data
        }
      })
    },
    tcChange () {
      this.getMargin()
    },
    logisticChange () {
      this.getMargin()
    },
    getMargin () { // 查询物流公司
      let postForm = {
        companyTcId: this.form.tcType === 1 ? this.form.tcId : this.form.companyId,
        tcType: this.form.tcType
      }
      CashDptMgeAjax.GetMargin(postForm).then(res => {
        if (res.code === 200) {
          this.form.balance = res.data
        }
      })
    },
    searchTrans (query) {
      if (query !== '') {
        this.loading = true
        this.getTrans(query)
      } else {
        this.getTrans(this.tcName)
      }
    },
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
.add-record-dialog {
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
