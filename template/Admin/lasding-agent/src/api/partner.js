import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询商户
 */
export function fetchPartners (params) {
  return request({
    url: '/tp/partner/find',
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
 * @description 获取商家树结构
 */
export function GetPartnerTree (params) {
  return request({
    url: '/tp/partner/tree',
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
 * @description 获取店铺列表
 */
export function GetShops (params) {
  return request({
    url: '/tp/shop/find',
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
 * @description 新增店铺
 */
export function addShop (params) {
  return request({
    url: '/tp/shop/create',
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
 * @description 编辑店铺信息
 */
export function editShop (params) {
  return request({
    url: '/tp/shop/edit',
    method: 'put',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询商家价格
 */
export function loadPartnerPrice (params) {
  return request({
    url: '/tp/partner/price/loadPartnerPrice',
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
 * @description 创建商家
 */
export function createPartner (params) {
  return request({
    url: '/tp/partner/createPartner',
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
 * @description 更新商家信息
 */
export function updatePartner (params) {
  return request({
    url: '/tp/partner/editPartner',
    method: 'put',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询商家详细信息系
 */
export function findDetail (partnerId) {
  return request({
    url: `/tp/partner/findDetail/${partnerId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询商家附件信息
 */
export function queryPartnerAttachment (params) {
  return request({
    url: '/tp/partner/queryPartnerAttachment',
    method: 'get',
    params: params
  })
}

/**
 *
 *
 * @export
 * @param {*} partnerId
 * @returns
 * @description 查询商家账户列表
 */
export function findPartnerUser (partnerId) {
  return request({
    url: `/tp/partner/findPartnerUser/${partnerId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询服务商授信额度
 */
export function queryAgentCredit (params) {
  return request({
    url: '/partner/account/queryAgentCredit',
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
 * @description 修改商家结算模式
 */
export function updatePayType (params) {
  return request({
    url: '/tp/partner/updatePayType',
    method: 'put',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询商家账户列表
 */
export function financeAccounts (params) {
  return request({
    url: '/partner/account/findList',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} partnerId
 * @returns
 * @description 商家账户详情
 */
export function financeAccountsDetail (partnerId) {
  return request({
    url: `/partner/account/detail/${partnerId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 商家账户充值
 */
export function partnerAccountRecharge (params) {
  return request({
    url: '/partner/account/recharge',
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
 * @description 获取商家流水记录
 */
export function findRecordList (params) {
  return request({
    url: '/partner/account/findRecordList',
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
 */
export function findBillList (params) {
  return request({
    url: '/partner/bill/findBillList',
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
 */
export function findWebBillStatis (params) {
  return request({
    url: '/partner/bill/findWebBillStatis',
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
 * @description 查询账单统计列表
 */
export function findWebBillStatisList (params) {
  return request({
    url: '/partner/bill/findWebBillStatisList',
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
 * @description 查询流水统计
 */
export function findRecordBillStatis (params) {
  return request({
    url: '/partner/account/findRecordBillStatis',
    method: 'post',
    data: params
  })
}
