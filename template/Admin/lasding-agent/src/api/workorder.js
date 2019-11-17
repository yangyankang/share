import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取工单列表
 */
export function GetWorkorder (params) {
  return request({
    url: '/wom/order/find',
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
 * @description 创建工单
 */
export function createWorkOrder (params) {
  return request({
    url: '/wom/order/create/az',
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
 * @description 创建检测工单
 */
export function createJCWorkOrder (params) {
  return request({
    url: '/wom/order/create/jc',
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
 * @description 创建维修单
 */
export function createRepairOrder (params) {
  return request({
    url: '/wom/order/create/wx',
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
 * @description 核销工单
 */
export function identifyOrder (params) {
  return request({
    url: '/wom/order/identify',
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
 * @description 预约失败
 */
export function failure (params) {
  return request({
    url: '/wom/order/failure',
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
 * @description 预约工单
 */
export function orderAssign (params) {
  return request({
    url: '/wom/order/assign',
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
 * @description 分配工单
 */
export function shareOrder (params) {
  return request({
    url: '/wom/order/share',
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
 * @description 延期预约工单
 */
export function delayOrder (params) {
  return request({
    url: '/wom/order/delay',
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
 * @description 工单回访
 */
export function visitOrder (params) {
  return request({
    url: '/wom/order/confirm/ok',
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
 * @description 查询待取消的工单
 */
export function findWaitCancel (params) {
  return request({
    url: '/wom/order/cancel/find',
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
 * @description 取消工单
 */
export function cancelOrder (params) {
  return request({
    url: '/wom/order/cancel',
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
 * @description 确认取消工单
 */
export function confirmCancelOrder (params) {
  return request({
    url: '/wom/order/confirm/cancel',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} serviceId
 * @returns
 * @description 获取工单详情
 */
export function GetDetailById (serviceId) {
  return request({
    url: `/wom/order/loadById/${serviceId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 加载工单统计
 */
export function loadFlowStatistics () {
  return request({
    url: '/wom/order/loadFlowStatistics',
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} serviceId
 * @returns
 * @description 查询工单操作记录
 */
export function findRecording (serviceId) {
  return request({
    url: `/wom/order/findRecording/${serviceId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} serviceId
 * @returns
 * @description 获取工单备注
 */
export function findComment (serviceId) {
  return request({
    url: `/wom/comment/find/${serviceId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取工单备注
 */
export function addWomComment (params) {
  return request({
    url: '/wom/comment/create',
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
 * @description 回复工单
 */
export function replyComment (params) {
  return request({
    url: '/wom/comment/reply',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} serviceId
 * @returns
 * @description 工单技师费用
 */
export function womTechCost (serviceId) {
  return request({
    url: `/wom/cost/find/${serviceId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 回访工单
 */
export function visitWom (params) {
  return request({
    url: '/wom/order/confirm/ok',
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
 * @description 获取申请的额外费用
 */
export function findApplyCost (params) {
  return request({
    url: '/wom/cost/apply/find',
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
 * @description 审核技师费用
 */
export function checkCost (params) {
  return request({
    url: '/wom/cost/apply/approve',
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
 * @description 驳回费用
 */
export function rejectCost (params) {
  return request({
    url: '/wom/cost/apply/refuse',
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
 * @description 获取待回访工单
 */
export function findIdentifyWom (params) {
  return request({
    url: '/wom/order/identify/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} costId
 * @returns
 * @description 取消工单技师费用
 */
export function cancelCost (costId, params) {
  return request({
    url: `/wom/cost/remove/${costId}`,
    method: 'get',
    params: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 新增工单技师费用
 */
export function addWomTechCost (params) {
  return request({
    url: '/wom/cost/create',
    method: 'post',
    data: params
  })
}
