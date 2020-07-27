const Enums = {
  // 运单状态
  waybillStatus: [{id: 11, name: '待装车'}, {id: 1, name: '待发车'}, {id: 2, name: '运输中'}, {id: 3, name: '已签收'}, {id: 4, name: '已拒签'}, {id: 6, name: '已取消'}],
  EXPORT_DAY: 180,
  DURING_TIME: 6 * 30 * 24 * 60 * 60 * 1000 // 180天
}
export default Enums
