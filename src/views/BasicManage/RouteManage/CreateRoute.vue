<template>
  <div class="create-route">
    <div class="public_card">
      <h3 class="detail_header">基础管理 / <span class="currentDetail">路由管理</span></h3>
      <div class="card_main">
        <div class="card_con">
          <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="newRules" label-width="100px">
            <div style="margin-bottom: 30px;">
              <el-form-item label="路由名称:" prop="lineName">
                <el-input v-model="form.lineName" :disabled="pageType === 'check'" placeholder="请输入路由名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="默认运费:" prop="defaultFreight">
                <el-input v-model="form.defaultFreight" @keyup.native="keyupFreight(form.defaultFreight,$event,)" :disabled="pageType === 'check'" placeholder="请输入默认运费" clearable></el-input>
              </el-form-item>
            </div>
            <div class="card_form_title">
              <span class="title_line"></span>
              <span class="title">路由信息</span>
            </div>
            <div class="">
              <el-row v-for="(item, index) in configList" :key="index">
                <el-col :span="24" class="configRow">
                  <el-form-item v-if="index === 0" label="起点:"></el-form-item>
                  <el-form-item v-if="index !== 0" label=" "></el-form-item>
                  <el-form-item>
                    <el-select :disabled="(index !== 0 && index !== configList.length - 1 || index === 0 && configList.length > 1 || pageType !== 'add')" v-model="item.startDcId" filterable placeholder="请选择分拨中心" @change="dcChange(item, index)" clearable>
                      <el-option
                        v-for="(item, index) in item.dcOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  &emsp;
                  <el-form-item>
                    <el-select :disabled="(index !== 0 && index !== configList.length - 1 || index === 0 && configList.length > 1 || pageType !== 'add')" v-model="item.lineId" filterable  placeholder="请选择线路" @change="lineChange(item, index)" clearable>
                      <el-option
                        v-for="(item, index) in item.lineOptions"
                        :key="index"
                        :label="item.lineName"
                        :value="item.lineId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item><span class="rightName">{{item.endDcName}}</span></el-form-item>
                  <el-form-item>
                    <i v-if="((configList.length === 1 && index === 0 && item.lineId !== '') || index === configList.length - 1 && item.lineId !== '') && pageType === 'add' " @click="addRow('add', item, index)" class="el-icon-circle-plus-outline"></i>&nbsp;
                    <i v-if="index !== 0 && index === configList.length - 1 && pageType === 'add'" @click="reduceRow(index)" class="el-icon-remove-outline"></i>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
         <div class="card_btn">
            <div class="search-btn-con">
              <el-button class="btn-main" v-if="saveShow" @click="save('form')">保存</el-button>
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
import RouteManageAjax from '@/api/BasicManage/RouteManage'
import BasicCommonAjax from '@/api/BasicManage/BasicCommon'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'CreateRoute',
  data () {
    return {
      saveShow: true,
      id: '',
      dialogDelShow: false, // 删除弹框显示判断
      dialogVisible: false, // 关闭班次弹框显示判断
      form: { // 表单
        lineName: '', // 线路名称
        defaultFreight: '' // 默认运费
      },
      configList: [],
      lineOptions: [
      ], // 运营公司集合
      dcOptions: [
      ], // 分拨中心集合
      newRules: { // 表单验证
        lineName: [
          { required: true, message: '请输入线路名称!', trigger: 'blur' }
        ],
        defaultFreight: [
          { required: true, message: '请输入默认运费!', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    pageType () {
      return this.$route.query.type
    }
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    } else {
      this.id = ''
    }
    this.init()
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    init () {
      if (this.pageType === 'add') {
        this.queryRoleDcList().then(res => {
          this.addRow('create')
        })
      }
      if (this.pageType === 'check') {
        this.saveShow = false
        this.queryRouteInfo(this.id)
      }
      if (this.pageType === 'edit') {
        this.queryRouteInfo(this.id)
      }
    },
    keyupFreight (val) {
      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 整数和俩位小数
        this.form.defaultFreight = val.match(/^\d{0,9}/g)[0] || null
      } else {
        this.form.defaultFreight = val.match(/^\d{0,9}(\.?\d{0,2})/g)[0] || null
      }
    },
    queryRoleDcList () { // 查询角色下分拨中心list
      return new Promise((resolve, reject) => {
        BasicCommonAjax.QueryRoleDcList().then(res => {
          if (res.code === 200) {
            this.dcOptions = res.data.map(item => {
              item.name = item.dcName
              return item
            })
            resolve(res.data)
          }
        })
      })
    },
    addRow (type, data, dataIndex) { // 增行
      if (type === 'create') {
        // this.configList = []
        let rowItemObj = {
          startDcName: '起点',
          startDcId: '',
          lineId: '',
          lineOptions: [],
          endDcName: '',
          endDcId: '',
          serialNumber: 0,
          dcOptions: this.dcOptions
        }
        this.configList.push(rowItemObj)
      }
      if (type === 'add') {
        let rowItemObj = {
          startDcName: data.endDcName,
          startDcId: data.endDcId,
          lineId: '',
          lineOptions: [],
          endDcName: '',
          endDcId: '',
          serialNumber: this.configList.length,
          dcOptions: data.endDcOptions
        }
        this.configList.push(rowItemObj)
        this.dcChange(rowItemObj, dataIndex + 1)
      }
    },
    reduceRow (rowIndex) { // 减行
      this.configList = this.configList.filter((item, index) => {
        return rowIndex !== index
      })
    },
    dcChange (rowItemObj, index) {
      RouteManageAjax.QueryLineAndEndDc({startDcId: rowItemObj.startDcId}).then(res => {
        if (res.code === 200) {
          this.configList = this.configList.map((cfgitem, cfgindex) => {
            if (cfgindex === index) {
              cfgitem.lineOptions = res.data
            }
            return cfgitem
          })
        }
      })
    },
    lineChange (item, index) {
      RouteManageAjax.QueryDcByLine({lineId: item.lineId}).then(res => {
        if (res.code === 200) {
          this.configList = this.configList.map((cfgitem, cfgindex) => {
            if (index === cfgindex) {
              cfgitem.endDcId = res.data[0].endDcId
              cfgitem.endDcName = res.data[0].endDcName
              cfgitem.endDcOptions = res.data.map((dcItem, index) => {
                dcItem.name = dcItem.endDcName
                dcItem.id = dcItem.endDcId
                return dcItem
              })
            }
            return cfgitem
          })
        }
      })
    },
    queryRouteInfo (val) {
      RouteManageAjax.QueryRouteInfo({id: val}).then(res => {
        if (res.code === 200) {
          this.form.lineName = res.data.lineName
          this.form.defaultFreight = res.data.defaultFreight
          this.configList = res.data.someRouterLineParams.map((item, index) => {
            item.startDcName = item.startDcName
            item.serialNumber = item.serialNumber
            item.lineOptions = res.data.someRouterLineParams
            item.dcOptions = res.data.someRouterLineParams.map(someItem => {
              someItem.name = someItem.startDcName
              someItem.id = someItem.startDcId
              return someItem
            })
            return item
          })
        }
      })
    },
    insertRoute (val) {
      RouteManageAjax.InsertRoute(val).then(res => {
        if (res.code === 200) {
          this.$router.push({name: 'RouteManage'})
          this.$notify({
            message: '新建成功！',
            type: 'success'
          })
        }
      })
    },
    updateRoute (val) {
      RouteManageAjax.UpdateRoute(val).then(res => {
        if (res.code === 200) {
          this.$router.push({name: 'RouteManage'})
          this.$notify({
            message: '修改成功！',
            type: 'success'
          })
        }
      })
    },
    save () { // 保存
      this.$refs.form.validate((valid) => {
        if (valid) {
          let postForm = {
            lineName: this.form.lineName,
            defaultFreight: this.form.defaultFreight,
            startDcId: this.configList[0].startDcId,
            endDcId: this.configList[this.configList.length - 1].endDcId,
            someRouterLineParams: []
          }
          this.configList.forEach((cfgItem, cfgIndex) => {
            let obj = {
              lineId: cfgItem.lineId,
              serialNumber: cfgItem.serialNumber
            }
            postForm.someRouterLineParams.push(obj)
          })
          if (this.pageType === 'add') {
            if (postForm.someRouterLineParams.length >= 2) {
              let unCheckLine = postForm.someRouterLineParams.some(item => {
                return item.lineId === ''
              })
              if (unCheckLine) {
                this.$notify({
                  message: '路由信息不完善，无法保存',
                  type: 'error'
                })
              } else {
                this.insertRoute(postForm)
              }
            } else {
              this.$notify({
                message: '路由线路至少要两条及以上',
                type: 'error'
              })
            }
          }
          if (this.pageType === 'edit') {
            postForm.routerId = this.id
            this.updateRoute(postForm)
          }
        }
      })
    },
    clickSure (flag) { // 弹框确定
    },
    clickCancel (flag) { // 弹框取消
    },
    validateShiftTable () { // 校验班次表格是否填写完整
    },
    goBack () { // 返回
      this.$router.push({name: 'RouteManage'})
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.create-route{
  display: flex;
  flex: 1;
  .card_main{
    // padding: 30px 40px;
    .el-form{
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .configRow {
      span {
        font-size: 13px;
      }
      .leftName {
        margin-right: 20px;
        width: 200px;
        display: inline-block;
        text-align: right
      }
      .rightName {
        margin-left: 20px;
        width: 200px;
        display: inline-block;
        text-align: left
      }
      i {
        font-size: 20px;
        margin-top: 6px;
      }
    }
    .card_btn {
      margin: 0 40px 20px 40px;
      .search-btn-con {
        float: right;
      }
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.create-route{
  .timeWrap {
    .el-input {
      width: 70%;
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
