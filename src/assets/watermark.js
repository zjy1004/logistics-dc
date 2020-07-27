let watermark = {}

let setWatermark = (str) => {
  let id = 'myCanvas'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  can.width = 400
  can.height = 100

  let cans = can.getContext('2d')
  cans.rotate(-20 * Math.PI / 180)
  cans.font = '36px Vedana'
  cans.fillStyle = 'rgba(255, 0, 0, 0.2)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  // cans.fillText(str, can.width / 20, can.height)
  cans.fillText(str, -10, 80)

  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '60px'
  div.style.left = '155px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = '400px'
  div.style.height = '100px'
  // div.style.width = document.documentElement.clientWidth + 'px'
  // div.style.height = (document.documentElement.clientHeight - 250) + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}
function clearWatermark () {
  let can = document.getElementById('myCanvas')
  let cans = can.getContext('2d')
  cans.clearRect(20, 100, can.width, can.height)
}
watermark.clear = () => {
  clearWatermark()
}
// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 2000)
  window.onresize = () => {
    setWatermark(str)
  }
}
// const MyPlugin = {}
// MyPlugin.install = function (Vue, options) {
//   // 4. 添加实例方法
//   Vue.prototype.$watermark = watermark
// }
export default watermark
