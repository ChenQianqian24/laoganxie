/**
 * 创建时间
 * @returns {string}
 */
export function date() {
  var mydate = new Date()
  var str = '' + mydate.getFullYear()
  //判断小于是是直接小于10月就可以了
  if (mydate.getMonth() < 10) {
    str += '0' + (mydate.getMonth() + 1)
  } else {
    str += mydate.getMonth() + 1
  }
  //判断小于是是直接小于10日就可以了
  if (mydate.getDate() < 10) {
    str += '0' + mydate.getDate()
  } else {
    str += mydate.getDate()
  }
  return str
}
