import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询品台列表
 */
export function findPlatform (params) {
  return request({
    url: '/sys/agent/center/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 添加新平台
 */
export function addPlatform (params) {
  return request({
    url: '/sys/agent/center/create',
    method: 'post',
    data: params
  })
}
