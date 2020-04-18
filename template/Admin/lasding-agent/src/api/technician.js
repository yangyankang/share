import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询已雇佣技师
 */
export function findHiredTech (params) {
  return request({
    url: '/technician/findHired',
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
 * @description 查询所属技师列表
 */
export function findTech (params) {
  return request({
    url: '/technician/find',
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
 * @description 查询技师自定义价格策略
 */
export function GetCustomStrategy (params) {
  return request({
    url: '/technician/strategy/find',
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
 * @description 创建技师价格策略
 */
export function createStrategy (params) {
  return request({
    url: '/technician/strategy/create',
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
 * @description 更新技师策略信息
 */
export function updateStrategy (params) {
  return request({
    url: '/technician/strategy/update',
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
 * @description 删除策略
 */
export function deleteStrategy (strategyId) {
  return request({
    url: `/technician/strategy/delete/${strategyId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 创建策略规则
 */
export function createStrategyRule (params) {
  return request({
    url: '/technician/strategy/create/rule',
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
 * @description 更新策略规则
 */
export function updateStrategyRule (params) {
  return request({
    url: '/technician/strategy/update/rule',
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
 * @description 删除技师策略规则
 */
export function deleteStrategyRule (ruleId) {
  return request({
    url: `/technician/strategy/delete/rule/${ruleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询技师团队
 */
export function findTechGroup (params) {
  return request({
    url: '/technician/group/find',
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
 * @description 创建技师团队
 */
export function createTechGroup (params) {
  return request({
    url: '/technician/group/create',
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
 * @description 修改技师团队信息
 */
export function updateTechGroup (params) {
  return request({
    url: '/technician/group/update',
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
 * @description 查询工单可用技师
 */
export function findWomValidTech (params) {
  return request({
    url: '/technician/findValid',
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
 * @description 查询可用技师团队
 */
export function findWomValidGroup (params) {
  return request({
    url: '/technician/group/findValid',
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
 * @description 查询技师团队成员
 */
export function techGroupMembers (params) {
  return request({
    url: '/technician/group/member/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} groupId
 * @returns
 * @description 删除技师团队
 */
export function deleteTechGroup (groupId) {
  return request({
    url: `/technician/group/delete/${groupId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} technicianId
 * @returns
 * @description 获取技师详情
 */
export function GetTechDetail (technicianId) {
  return request({
    url: `/technician/loadById/${technicianId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 驳回技师
 */
export function rejectTech (params) {
  return request({
    url: '/technician/reject',
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
 * @description 通过及技师
 */
export function approveTech (params) {
  return request({
    url: '/technician/approve',
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
 * @description 删除技师组成员
 */
export function deleteTechGroupMember (params) {
  return request({
    url: '/technician/group/member/delete',
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
 * @description 群组添加成员
 */
export function addGroupMembers (params) {
  return request({
    url: '/technician/group/member/create',
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
 * @description 创建技师
 */
export function createTech (params) {
  return request({
    url: '/technician/create',
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
 * @description
 */
export function updateTech (params) {
  return request({
    url: '/technician/update',
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
 * @description 查询技师策略
 */
export function findTechStrategy (params) {
  return request({
    url: '/technician/strategy/find',
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
 * @description 查询待审核技师列表
 */
export function findTechAuditing (params) {
  return request({
    url: '/technician/findAuditing',
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
 * @description 查找技师计划
 */
export function findTechPlan (params) {
  return request({
    url: '/technician/findPlan',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} technicianId
 * @returns
 * @description 查找技师在那些团队
 */
export function findTechInGroup (technicianId) {
  return request({
    url: `/technician/group/member/${technicianId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取技师日程
 */
export function findGroupPlan (params) {
  return request({
    url: '/technician/group/findPlan',
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
 * @description 获取技师账户列表
 */
export function findTechAccounts (params) {
  return request({
    url: '/technician/account/find',
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
 * @description 技师账单统计
 */
export function billStatics (params) {
  return request({
    url: '/technician/account/summary/find',
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
 * @description 账单交易流水
 */
export function billRecords (params) {
  return request({
    url: '/technician/account/bill/flow/find',
    method: 'post',
    data: params
  })
}
