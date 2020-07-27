import { Get, Post, PostFromData } from '@/api/axios.config'

const BasicCommonAjax = {
  QueryAreaList (params) {
    // 获取省市级联列表
    let result = Get('/dc/AreaCode/query/list', params)
    return result
  },
  QueryOpCoyList (params) {
    // 获取下拉框(运营公司列表)
    let result = Post('/dc/company/query/operationCompanyList', params)
    return result
  },
  QueryLogisticsList (params) {
    // 获取下拉框(关联物流列表)
    let result = Post('/dc/company/query/logisticsCompanyList', params)
    return result
  },
  QueryDcList (params) {
    // 获取下拉框(分拨中心列表)
    let result = Post('/dc/line/query/cdIdAndNameList', params)
    return result
  },
  QueryRoleDcList (params) {
    // 下拉框(分拨中心下拉框区分角色)
    let result = PostFromData('/dc/line/query/cdIdAndNameListByRoleType', params)
    return result
  },
  QueryTranspList (params) {
    // 下拉框(线路回显界面运力字段显示内容)
    let result = PostFromData('/dc/line/query/lineTransportCapacityList', params)
    return result
  },
  QueryLineList (params) {
    // 获取所有配送线路
    let result = Get('/dc/client/query/deliveryCityAll', params)
    return result
  },
  QueryDcLineList (params) {
    // 获取所有配送线路
    let result = Get('/dc/client/query/deliveryCityAll', params)
    return result
  },
  ValidAccount (params) {
    // 获取所有配送线路
    let result = Get('/dc/auth/account/valid', params)
    return result
  },
  ValidClientPhone (params) {
    // 校验同一分拨中心下手机号不可重复(只能客户管理新增验证)
    let result = PostFromData('/dc/client/check/client/phone', params)
    return result
  },
  ValidStaffPhone (params) {
    // 校验同一分拨中心下手机号不可重复(只能员工管理新增验证)
    let result = PostFromData('/dc/client/check/phone', params)
    return result
  },
  ValidLineName (params) {
    // 校验同一分拨中心下专线/配送线路名称不可重复
    let result = PostFromData('/dc/line/check/lineName', params)
    return result
  }
}

export default BasicCommonAjax
