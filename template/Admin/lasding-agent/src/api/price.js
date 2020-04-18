import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取价格类型列表
 */
export function GetPriceTypes (params) {
  return request({
    url: '/price/type/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} id
 * @returns
 * @description 删除价格类型
 */
export function deletePriceType (id) {
  return request({
    url: `/price/type/delete/${id}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 创建价格类型
 */
export function createPriceType (params) {
  return request({
    url: '/price/type/create',
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
 * @description 修改价格类型信息
 */
export function updatePriceType (params) {
  return request({
    url: '/price/type/update',
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
 * @description 获取价格策略列表
 */
export function GetPriceStrategy (params) {
  return request({
    url: '/price/strategy/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns 创建价格策略
 */
export function createStrategy (params) {
  return request({
    url: '/price/strategy/create',
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
 * @description 修改价格策略信息
 */
export function updateStrategy (params) {
  return request({
    url: '/price/strategy/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} strategyId
 * @returns
 * @description 删除价格策略
 */
export function deleteStrategy (strategyId) {
  return request({
    url: `/price/strategy/delete/${strategyId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询价格策略规则
 */
export function findStrategyRule (params) {
  return request({
    url: '/price/strategy/findStrategyRule',
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
 * @description 创建价格策略规则
 */
export function createStrategyRule (params) {
  return request({
    url: '/price/strategy/createStrategyRule',
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
 * @description 更新策略信息
 */
export function updateStrategyRule (params) {
  return request({
    url: '/price/strategy/updateStrategyRule',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} ruleId
 * @returns
 * @description 删除策略规则
 */
export function deleteStrategyRule (ruleId) {
  return request({
    url: `/price/strategy/deleteStrategyRule/${ruleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 获取商家策略
 */
export function GetTPStrategy (params) {
  return request({
    url: '/tp/strategy/find',
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
 * @description 创建商家策略
 */
export function createTPStrategy (params) {
  return request({
    url: '/tp/strategy/create',
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
 * @description 修改商家策略信息
 */
export function updateTPStrategy (params) {
  return request({
    url: '/tp/strategy/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} strategyId
 * @returns
 * @description 删除商家策略
 */
export function deleteTPStrategy (strategyId) {
  return request({
    url: `/tp/strategy/delete/${strategyId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 创建商家策略规则
 */
export function createTPStrategyRule (params) {
  return request({
    url: '/tp/strategy/rule/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 更新商家策略规则信息
 */
export function updateTPStrategyRule (params) {
  return request({
    url: '/tp/strategy/rule/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} ruleId
 * @returns
 * @description 删除商家策略规则
 */
export function deleteTPStrategyRule (ruleId) {
  return request({
    url: `/tp/strategy/rule/delete/${ruleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 查询商家自定义策略
 */
export function GetTPCustomStrategy (params) {
  return request({
    url: '/tp/partner/strategy/find',
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
 * @description 创建商家自定义策略
 */
export function createTPCustomStrategy (params) {
  return request({
    url: '/tp/partner/strategy/create',
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
 * @description 更新商家自定义策略信息
 */
export function updateTPCustomStrategy (params) {
  return request({
    url: '/tp/partner/strategy/update',
    method: 'post',
    data: params
  })
}

export function deleteTPCustomStrategy () {
  return request({
    url: '/'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 创建商家自定义策略规则
 */
export function createTPCustomStrategyRule (params) {
  return request({
    url: '/tp/partner/strategy/rule/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} ruleId
 * @returns
 * @description 删除商家自定义策略规则
 */
export function deleteTPCustomStrategyRule (ruleId) {
  return request({
    url: `/tp/partner/strategy/rule/delete/${ruleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询价格组
 */
export function GetTpPriceGroup (params) {
  return request({
    url: '/tp/price/group/find',
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
 * @description 创建策略组
 */
export function createTpPriceGroup (params) {
  return request({
    url: '/tp/price/group/create',
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
export function updateTpPriceGroup (params) {
  return request({
    url: '/tp/price/group/update',
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
 * @description 给价格组添加价格策略
 */
export function addPriceGroupStrategy (params) {
  return request({
    url: '/tp/price/group/strategy/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} id
 * @returns
 * @description 删除商家价格组策略
 */
export function deletePriceGroupStrategy (id) {
  return request({
    url: `/tp/price/group/strategy/delete/${id}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取商家价格组策略
 */
export function GetGroupStrategy (params) {
  return request({
    url: '/tp/price/group/strategy/find',
    method: 'post',
    data: params
  })
}

export function GetGroupRegionTree (params) {
  return request({
    url: '/tp/price/group/rule/region/valid/tree',
    method: 'post',
    data: params
  })
}

export function GetStrategyRegions (params) {
  return request({
    url: '/tp/price/group/rule/region/find',
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
export function saveTpStrategyRegions (params) {
  return request({
    url: '/tp/price/group/rule/region/create',
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
 * @description 商家自定义价格组
 */
export function getTPCustomPriceGroup (params) {
  return request({
    url: '/tp/partner/price/group/find',
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
 * @description 创建商家自定义价格组
 */
export function createTpCustomPriceGroup (params) {
  return request({
    url: '/tp/partner/price/group/create',
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
 * @description 获取商家自定义价格组
 */
export function GetTpCustomPriceGroupStrategy (params) {
  return request({
    url: '/tp/partner/price/group/strategy/find',
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
 * @description 创建商家自定价格组策略
 */
export function createTpCustomPriceGroupStrategy (params) {
  return request({
    url: '/tp/partner/price/group/strategy/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} groupStrategyId
 * @returns
 * @description 删除商家自定义价格组策略
 */
export function deleteTpCustomPriceGroupStrategy (groupStrategyId) {
  return request({
    url: `/tp/partner/price/group/strategy/delete/${groupStrategyId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取商家自定义价格组策略可用的地区
 */
export function GetTpCustomGroupStrategyRegionTree (params) {
  return request({
    url: '/tp/partner/price/group/rule/region/valid/tree',
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
 * @description 获取商家自定价格组策略已选地区
 */
export function GetTpCustomGroupStrategyOldRegion (params) {
  return request({
    url: '/tp/partner/price/group/rule/region/find',
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
 * @description 保存商家自定价格组策略地区
 */
export function saveTpCustomGroupStrategyRegion (params) {
  return request({
    url: '/tp/partner/price/group/rule/region/create',
    method: 'post',
    data: params
  })
}
