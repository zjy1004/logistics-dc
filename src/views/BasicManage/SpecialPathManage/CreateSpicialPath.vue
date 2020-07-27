<template>
  <div class="create-special-path">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">专线线路</span></h3>
      <div class="card_main">
        <div class="card_con">
          <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="newRules" label-width="100px">
           <el-form-item label="发货分拨中心:" prop="startDc">
            <el-select :disabled="this.pageType === 'edit' || pageType === 'check'" v-model="form.startDc" filterable placeholder="请选择发货分拨中心" clearable>
              <el-option
                v-for="(item, index) in startDcOption"
                :key="index"
                :label="item.dcName"
                :value="item.id">
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="配送分拨中心:" prop="endDc">
              <el-select :disabled="pageType === 'edit' || pageType === 'check'" v-model="form.endDc" filterable placeholder="请选择配送分拨中心" clearable>
                <el-option
                  v-for="(item, index) in endDcOptions"
                  :key="index"
                  :label="item.dcName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路名称:" prop="lineName">
              <el-input v-model="form.lineName" :disabled="pageType === 'check'" placeholder="请输入路线名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="默认运费:" prop="defaultFreight">
              <el-input v-model="form.defaultFreight" @keyup.native="keyupFreight(form.defaultFreight,$event,)" :disabled="pageType === 'check'" placeholder="请输入默认运费" clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="btns" v-if="pageType !== 'check'">
            <el-button class="btn-main" @click="addPkLine('new')" :disabled="!shiftSwitch">增加班次</el-button>
            <el-button class="btn-common" @click="newDel()">删除</el-button>
            <span class="title">设置班次</span>
            <span style="margin-left:10px;">
            <el-switch
              @change="switchChange(shiftSwitch)"
              v-model="shiftSwitch">
            </el-switch>
            </span>
            <span v-show="shiftSwitch" style="margin-left:10px; color: red;">表内班次顺序为实际执行顺序</span>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                  min-width="3%"
                  prop="serialNumber"
                  label="序号">
                <template slot-scope="scope">
                  <span>{{scope.row.serialNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="shiftName"
                label="发车班次">
                <template slot-scope="scope">
                  <div class="timeWrap">
                    <el-input v-show="shiftSwitch" :disabled="pageType === 'check'" v-model="scope.row.shiftName" size="small" maxlength="7" placeholder="请输入发车班次" clearable />
                    <el-input v-show="!shiftSwitch"  v-model="scope.row.shiftName" disabled size="small" placeholder="无班次" clearable />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="transportCapacityId"
                label="运力">
                <template slot-scope="scope" >
                  <div class="trsWrap">
                    <el-select v-model="scope.row.transportCapacityId" :disabled="pageType === 'check'" placeholder="请选择运力">
                    <el-option
                      v-for="item in transpList"
                      :key="item.userId"
                      :label="item.transportCapacitySpellName"
                      :value="item.transportCapacityId">
                    </el-option>
                  </el-select>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="card_btn">
          <div class="search-btn-con">
            <el-button v-if="saveShow" class="btn-main" @click="save()">保存</el-button>
            <el-button class="btn-common" @click="goBack()">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="关闭班次设置会删除已有班次信息，是否确认关闭"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel('enAbleShift')"
      @click-sure="clickSure('enAbleShift')"
    />
    <v-dialog
      v-if="dialogDelShow"
      title="提示"
      :width="'486px'"
      mainText="是否确认删除班次信息"
      :closeClickModal="false"
      :dialogVisible="dialogDelShow"
      @click-cancel="clickCancel('del')"
      @click-sure="clickSure('del')"
    />
  </div>
</template>

<script>
import SpecialPathAjax from '@/api/BasicManage/SpecialPathManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'CreateSpicialPath',
  data () {
    return {
      saveShow: true,
      id: '',
      dialogDelShow: false, // 删除弹框显示判断
      shiftSwitch: true, // 班次按钮状态显示判断
      dialogVisible: false, // 关闭班次弹框显示判断
      form: { // 表单
        startDc: '', // 运营公司
        endDc: '', // 分拨中心
        lineName: '', // 线路名称
        defaultFreight: '', // 默认运费
        shiftType: '' // 班次禁用状态
      },
      newRules: { // 表单验证
        startDc: [
          { required: true, message: '请选择分拨中心！', trigger: 'change' }
        ],
        endDc: [
          { required: true, message: '请选择分拨中心！', trigger: 'change' }
        ],
        lineName: [
          { required: true, message: '请输入线路名称!', trigger: 'blur' }
        ],
        defaultFreight: [
          { required: true, message: '请输入默认运费!', trigger: 'blur' }
        ]
      },
      opcoyOptions: [], // 运营公司集合
      startDcOption: [], // 发货分拨中心集合
      endDcOptions: [], // 配送分拨中心集合
      multipleSelection: [],
      transpList: [], // 运力集合
      tableData: [] // 表格数据
    }
  },
  computed: {
    pageType () {
      return this.$route.query.type
    }
  },
  watch: {
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    } else {
      this.id = ''
    }
    this.init()
  },
  methods: {
    init () {
      this.queryDcList()
      this.queryTrans()
      this.queryRoleDcList()
      if (this.pageType === 'add') {
        this.form.shiftType = 20
        this.addPkLine()
      }
      if (this.pageType === 'check') {
        this.queryLineShift(this.id)
        this.saveShow = false
      }
      if (this.pageType === 'edit') {
        this.queryLineShift(this.id)
      }
    },
    keyupFreight (val) {
      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 整数和俩位小数
        this.form.defaultFreight = val.match(/^\d{0,9}/g)[0] || null
        this.form.defaultFreight = val.match(/^[1-9]\d*$/)[0] || null
      } else {
        this.form.defaultFreight = val.match(/^\d{0,9}(\.?\d{0,2})/g)[0] || null
      }
    },
    queryRoleDcList () { // 查询角色下分拨中心list
      BasicCommonAjax.QueryRoleDcList().then(res => {
        if (res.code === 200) {
          this.startDcOption = res.data
        }
      })
    },
    queryDcList () { // 查询分拨中心list
      BasicCommonAjax.QueryDcList().then(res => {
        if (res.code === 200) {
          this.endDcOptions = res.data
        }
      })
    },
    queryTrans () { // 查询运力
      BasicCommonAjax.QueryTranspList({deliveryType: 20}).then(response => {
        if (response.code === 200) {
          this.transpList = response.data
        }
      })
    },
    // 班次切换
    switchChange (val) {
      if (val) {
        this.tableData = []
        this.addPkLine()
        this.form.shiftType = 20
      } else {
        this.dialogVisible = true
      }
    },
    newDel () { // 新增路线删除，前端删除
      if (this.multipleSelection.length < 1) {
        this.$notify({
          message: '未选择班次记录，无法进行删除操作',
          type: 'error'
        })
      } else {
        if (this.tableData.length > 0) {
          this.dialogDelShow = true
        }
      }
    },
    resetTable () { // 重新为表格赋值
      this.tableData = this.tableData.map((item, index) => {
        item.serialNumber = index + 1
        return item
      })
    },
    addPkLine () { // 添加班次
      let newObj = {shiftName: '', transportCapacityId: '', shiftId: '', serialNumber: ''}
      newObj.serialNumber = this.tableData.length
      this.tableData.push(newObj)
      this.resetTable()
    },
    queryLineShift (val) { // 修改查看,获取数据
      SpecialPathAjax.QuerySpecialLineInfo({lineId: val}).then(res => {
        if (res.code === 200) {
          this.form.startDc = res.data.startDc
          this.form.endDc = res.data.endDc
          this.form.lineName = res.data.lineName
          this.form.defaultFreight = res.data.defaultFreight
          this.tableData = res.data.shiftSaveParams
          if (res.data.shiftType === 20) {
            this.shiftSwitch = true
            this.form.shiftType = 20
          } else {
            this.form.shiftType = 10
            this.shiftSwitch = false
          }
        }
      })
    },
    formData () {
      let postData = {
        startDc: this.form.startDc,
        endDc: this.form.endDc,
        defaultFreight: this.form.defaultFreight,
        shiftType: this.form.shiftType,
        lineName: this.form.lineName,
        lineId: this.id,
        shiftSaveParams: []
      }
      postData.shiftSaveParams = this.tableData.map(item => {
        if (postData.shiftType === 20) {
          return {
            shiftName: item.shiftName,
            serialNumber: item.serialNumber,
            transportCapacityId: item.transportCapacityId,
            shiftId: item.shiftId
          }
        } else {
          return {
            shiftName: '无班次',
            serialNumber: item.serialNumber,
            transportCapacityId: item.transportCapacityId,
            shiftId: item.shiftId
          }
        }
      })
      return postData
    },
    // 新增
    insert (val) {
      SpecialPathAjax.InsertSpecialLine(val).then(response => {
        if (response.code === 200) {
          this.$router.push({name: 'SpecialPathManage'})
          this.$notify({
            message: '新建成功！',
            type: 'success'
          })
        }
      })
    },
    // 修改
    upDate (val) {
      SpecialPathAjax.UpdateSpecialLine(val).then(response => {
        if (response.code === 200) {
          this.$router.push({name: 'SpecialPathManage'})
          this.$notify({
            message: '修改成功！',
            type: 'success'
          })
        }
      })
    },
    save () { // 保存
      this.$refs.form.validate((valid) => {
        let tableValidateResult = this.validateShiftTable()
        if (!tableValidateResult) { // 表格数据校验不通过
          this.$notify({
            message: '请完善班次表格数据再试！',
            type: 'error'
          })
          return false
        }
        if (valid) {
          this.validLineNameAjax().then(res => {
            if (!res) {
              let postData = this.formData()
              if (this.pageType === 'add') {
                this.insert(postData)
              }
              if (this.pageType === 'edit') {
                this.upDate(postData)
              }
            }
          })
        }
      })
    },
    validLineNameAjax () {
      return new Promise((resolve, reject) => {
        let postForm = {
          dcId: this.form.startDc,
          lineName: this.form.lineName,
          lineType: 20,
          lineId: this.id
        }
        BasicCommonAjax.ValidLineName(postForm).then(res => {
          if (res.code === 200) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    clickSure (flag) { // 弹框确定
      if (flag === 'enAbleShift') {
        this.tableData = []
        this.addPkLine()
        this.form.shiftType = 10
        this.shiftSwitch = false
        this.dialogVisible = false
      }
      if (flag === 'del') {
        this.dialogDelShow = false
        if (this.tableData.length > 1) {
          let difference = new Set([...this.tableData].filter(x => !this.multipleSelection.includes(x)))
          this.tableData = [...difference]
          this.resetTable()
          if (this.tableData.length === 0) {
            this.addPkLine()
          }
        } else {
          this.$notify({
            message: '仅有一条班次信息无法进行删除',
            type: 'error'
          })
        }
      }
    },
    clickCancel (flag) { // 弹框取消
      if (flag === 'enAbleShift') {
        this.shiftSwitch = true
        this.dialogVisible = false
      }
      if (flag === 'del') {
        this.dialogDelShow = false
      }
    },
    validateShiftTable () { // 校验班次表格是否填写完整
      let result = true
      if (this.shiftSwitch) {
        result = this.tableData.every((item, index) => {
          return item.shiftName !== '' && item.transportCapacityId !== ''
        })
      } else {
        result = this.tableData.every((item, index) => {
          return item.transportCapacityId !== ''
        })
      }
      return result
    },
    goBack () { // 返回
      this.$router.push({name: 'SpecialPathManage'})
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.create-special-path{
  display: flex;
  flex: 1;
  .card_main{
    // padding: 30px 40px;
    .card_con {
      display: flex;
      flex-direction: column;
    }
    .el-form{
      margin: 10px 0;
    }
    .btns{
      height: 32px;
      margin: 10px 0 15px 0;
      .title {
        margin-left: 30px;
        font-size: 13px;
      }
    }
    .table-con{
      display: flex;
      flex: 1;
      width: 99%;
      i {
        font-size: 16px;
      }
      .driverWrap {
        margin-top: 2px;
      }
    }
    .bottom-btns{
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.create-special-path{
  .timeWrap {
    .el-input {
      width: 70%;
    }
  }
  .trsWrap {
    .el-select {
      width: 50%;
    }
  }
  .visible-icon{
    visibility:hidden;
  }
  .el-switch.is-checked .el-switch__core{
    background-color: #04B8D7;
    border-color: #04B8D7;
  }
}
</style>
