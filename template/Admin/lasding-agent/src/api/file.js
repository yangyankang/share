import * as qiniu from 'qiniu-js'

import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns 获取token
 */
export function GetToken (params) {
  return request({
    url: '/qiniu/qiniuToken',
    method: 'get',
    params: params
  })
}

export function addZero (n) {
  return n < 10 ? '0' + n : n + ''
}

function returnDate () {
  let dNow = new Date()
  let dYear = dNow.getFullYear()
  let dMonth = dNow.getMonth()
  let dDay = dNow.getDate()
  // let dH = dNow.getHours()
  // let dm = dNow.getMinutes()
  // let ds = dNow.getSeconds()
  return dYear +
    '' +
    addZero(dMonth) +
    '' +
    addZero(dDay)
}

/**
 *
 *
 * @export
 * @param {*} file
 * @param {*} key /模块/功能
 * @param {*} token
 * @param {*} [putExtra={
 *     fname: file.name,
 *     mimeType: null,
 *     params: {}
 *   }]
 * @param {*} config
 * @returns
 */
export function fileQniu (
  file,
  key,
  token,
  putExtra = {
    fname: file.name,
    mimeType: null,
    params: {}
  },
  config
) {
  return qiniu.upload(
    file,
    returnDate() + '/web/' + key + '/' + Date.now() + '/' + file.name,
    token,
    putExtra,
    config
  )
}
