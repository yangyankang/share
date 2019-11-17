import request from '@/utils/request'

/**
 *
 *
 * @export
 * @returns
 * @param {Object} params
 *  username 账号
 *  password 密码
 * @description 登录接口
 */
export function login (params) {
  return request({
    url: '/login',
    method: 'post',
    data: params
  })
}

export function userInfo (params) {
  return request({
    url: '/user/info',
    method: 'get',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *  no
 * @returns
 */
export function userMenu (params = {}) {
  return request({
    url: '/sys/menu/tree',
    method: 'get',
    data: params
  })
}
