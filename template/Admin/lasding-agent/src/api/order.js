import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 向后台发送支付成功消息
 */
export function payNotify (params) {
  return request({
    url: '/order/byBalance/notify',
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
 * @description 查询订单
 */
export function findOrders (params) {
  return request({
    url: '/order/find',
    method: 'post',
    data: params
  })
}
