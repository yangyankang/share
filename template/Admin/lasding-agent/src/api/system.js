import request from '@/utils/request'

//
//  菜单管理
//

/**
 *
 *
 * @export
 * @returns
 * @description 菜单树
 */
export function MenulistTree () {
  return request({
    url: '/sys/menu/listTree',
    method: 'get',
    params: {
    }
  })
}

/**
 *
 *
 * @export
 * @param {Object} params
 *  name
 *  url
 *  icon
 *  hidden
 *  route
 *  component
 *  partnerId
 *  redirect
 *  menuType
 * @returns
 * @description 创建菜单
 */
export function createMenu (params) {
  return request({
    url: '/sys/menu/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *  {同上}
 *  id
 * @returns
 * @description 修改保存菜单
 */
export function updateMenu (params) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {String|Number} menuId
 * @returns
 * @description 删除菜单
 */
export function removeMenu (menuId) {
  return request({
    url: `/sys/menu/delete/${menuId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {String|Number} menuId
 * @returns
 * @description 加载菜单详情
 */
export function loadMenuDetail (menuId) {
  return request({
    url: `/sys/menu/loadById/${menuId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {Object} params
 *   description
 *   dictCode
 *   dictName
 * @returns
 * @description 创建字典集
 */
export function createDict (params) {
  return request({
    url: '/sys/dict/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *   {同上}
 *   id
 * @returns
 */
export function updateDict (params) {
  return request({
    url: '/sys/dict/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} dictId
 * @returns
 * @description 删除字典
 */
export function deleteDict (dictId) {
  return request({
    url: `/sys/dict/delete/${dictId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 查询字典集列表
 */
export function GetDictList (params) {
  return request({
    url: '/sys/dict/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} dictCode
 * @returns
 * @description 根据字典编码查询字典项
 */
export function getDictItems (dictCode) {
  return request({
    url: `/sys/dict/getDictItems/${dictCode}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {Object} params
 *  dictId
 *  itemText
 *  itemValue
 *  sortOrder
 *  status
 *  description
 * @returns
 */
export function createDictItem (params) {
  return request({
    url: '/sys/dict/item/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *  {同上}
 *  id
 * @returns
 */
export function updateDictItem (params) {
  return request({
    url: '/sys/dict/item/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} itemId
 * @returns
 * @description 删除字典项
 */
export function deleteDictItem (itemId) {
  return request({
    url: `/sys/dict/item/delete/${itemId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *   dictId
 *   page {Object}
 *    pageNum
 *    pageSize
 * @returns
 */
export function GetDictItem (params) {
  return request({
    url: '/sys/dict/findItem',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *   page
 *    pageNum
 *    pageSize
 * @returns
 * @description 获取组织，机构 里诶表
 */
export function GetAgentList (params) {
  return request({
    url: '/sys/agent/find',
    method: 'post',
    data: params
  })
}

export function GetAgentListTree (params) {
  return request({
    url: '/sys/agent/tree',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 获取用户机构树
 */
export function GetUserAgentTree () {
  return request({
    url: '/user/agent/tree',
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 续费
 */
export function agentRenew (params) {
  return request({
    url: '/sys/agent/renew',
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
 * @description 创建支付账单
 */
export function bilCreate (params) {
  return request({
    url: '/order/bill/create',
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
 * @description 支付订单
 */
export function payOrder (params) {
  return request({
    url: '/agent/account/initiate/payment',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @returns
 */
export function userRegionTree () {
  return request({
    url: '/user/region/tree',
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {Object} params
 *  name
 *  status
 *  parentId
 *  type
 *  invalidTime
 *  validTime
 * @returns
 */
export function createAgent (params) {
  return request({
    url: '/sys/agent/create',
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
 * @description 修改、编辑机构
 */
export function updateAgent (params) {
  return request({
    url: '/sys/agent/update',
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
 */
export function deleteAgent (id) {
  return request({
    url: `/sys/agent/delete/${id}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 查询机构树
 */
export function GetAgentTree () {
  return request({
    url: '/sys/agent/tree',
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} agentId
 * @returns
 * @description 查询机构地区权限
 */
export function findRegionPerm (agentId) {
  return request({
    url: `/sys/agent/findRegionPerm/${agentId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 保存接口地区权限
 */
export function saveRegionPerms (params) {
  return request({
    url: '/sys/agent/saveRegionPerms',
    method: 'post',
    data: params
  })
}

/**
 *
 * @export
 * @param {*} url
 * @returns
 * @description 查询表格配置
 */
export function hasTableConfig (url) {
  return request({
    url: `${url}/display/load`,
    method: 'get'
  })
}

export function tableConfig (url) {
  return request({
    url: `${url}/display/load/config`,
    method: 'get'
  })
}

export function userTableConfig (url) {
  return request({
    url: `${url}/display/load/user`,
    method: 'get'
  })
}

export function saveUserTableConfig (url, params) {
  return request({
    url: `${url}/display/save`,
    method: 'post',
    data: params
  })
}

export function saveGlobalTableConfig (url, params) {
  return request({
    url: `${url}/display/config/save`,
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 查询表格所有可配置字段
 */
export function allTableFields (url) {
  return request({
    url: `${url}/display/config`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取角色列表
 */
export function GetRoleList (params) {
  return request({
    url: '/sys/role/list',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 *  roleName
 *  roleCode
 *  description
 * @returns
 * @description 创建角色
 */
export function createRole (params) {
  return request({
    url: '/sys/role/create',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} roleId
 * @returns
 * @description 删除角色
 */
export function deleteRole (roleId) {
  return request({
    url: `/sys/role/delete/${roleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 修改保存角色信息
 */
export function updateRole (params) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} roleId
 * @returns
 * @description 查询当前用户可配置权限
 */
export function findMenuPermTree (roleId) {
  return request({
    url: `/sys/role/findMenuPermTree/${roleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 查询当前用户可配置菜单
 */
export function findUserConfigMenu () {
  return request({
    url: '/user/perm/menu',
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {Object} params
 * @returns
 * @description 保存用户地区数据权限
 */
export function saveUserRegionPerms (params) {
  return request({
    url: '/sys/user/saveRegionPerms',
    method: 'POST',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} userId
 * @returns
 * @description 查询用户地区权限
 */
export function findUserRegionPerm (userId) {
  return request({
    url: `/sys/user/findRegionPerm/${userId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} roleId
 * @returns
 * @description 查询角色已配置权限
 */
export function findMenuPerms (roleId) {
  return request({
    url: `/sys/role/findMenuPerms/${roleId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} roleId
 * @param {*} menuIds
 * @returns
 * @description 保存角色权限
 */
export function saveMenuPerms (roleId, menuIds) {
  return request({
    url: `/sys/role/saveMenuPerms/${roleId}`,
    method: 'post',
    data: menuIds
  })
}

/**
 *
 *
 * @export
 * @param {*} level
 * @returns
 * @description 查询地区菜单树
 */
export function GetRegions (level) {
  return request({
    url: '/region/findTree/three',
    method: 'get',
    data: {
      regionGrade: level
    }
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 查询地区菜单列表
 */
export function GetRegionsList (params) {
  return request({
    url: '/region/find',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {Object} params
 *  parentCode
 *  regionCode
 *  regionGrade
 *  regionName
 *  regionType
 * @returns
 * @description 创建地区信息
 */
export function createRegion (params) {
  return request({
    url: '/create',
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
 * @description 更新地区信息
 */
export function updateRegion (params) {
  return request({
    url: '/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} regionCode
 * @returns
 * @description 删除地区
 */
export function deleteRegion (regionCode) {
  return request({
    url: `/delete/${regionCode}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} [params={}]
 * @returns
 * @description 获取部门书
 */
export function GetDepartListTree (params = {}) {
  return request({
    url: '/sys/depart/tree',
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
 * @description 创建部门
 */
export function createDepart (params) {
  return request({
    url: '/sys/depart/create',
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
 * @description 修改部门信息
 */
export function updateDepart (params) {
  return request({
    url: '/sys/depart/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} departId
 * @returns
 * @description 删除部门
 */
export function deleteDepart (departId) {
  return request({
    url: `/sys/depart/delete/${departId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取用户列表
 */
export function GetUserList (params) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} userId
 * @returns
 * @description 删除用户
 */
export function deleteUser (userId) {
  return request({
    url: `/sys/user/delete/${userId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 创建用户
 */
export function createUser (params) {
  return request({
    url: '/sys/user/create',
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
 * @description 修改用户信息
 */
export function updateUser (params) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} userId
 * @returns
 * @description 获取用户详情
 */
export function GetUserDetail (userId) {
  return request({
    url: `/sys/user/load/${userId}`,
    method: 'get'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取系统日志
 */
export function GetSystemLog (params) {
  return request({
    url: '/sys/log/find',
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
 * @description 定时任务查询
 */
export function GetQuartzJob (params) {
  return request({
    url: '/sys/quartzJob/find',
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
 * @description 创建定时任务
 */
export function createQuartzJob (params) {
  return request({
    url: '/sys/quartzJob/create',
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
 * @description 修改定时任务信息
 */
export function updateQuartzJob (params) {
  return request({
    url: '/sys/quartzJob/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} jobId
 * @returns
 * @description 删除定时任务
 */
export function deleteQuartzJob (jobId) {
  return request({
    url: `/sys/quartzJob/delete/${jobId}`,
    method: 'post'
  })
}
/**
 *
 *
 * @export
 * @param {*} jobId
 * @returns
 * @description 启用定时任务
 */
export function startJob (jobId) {
  return request({
    url: `/sys/quartzJob/startJob/${jobId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} jobId
 * @returns
 * @description 关闭定时任务
 */
export function closeJob (jobId) {
  return request({
    url: `/sys/quartzJob/stopJob/${jobId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @returns
 */
export function regionRegeo (address) {
  return request({
    url: '/regeo/address',
    method: 'post',
    params: {
      address
    }
  })
}

/**
 *
 *
 * @export
 * @param {*} address
 * @returns
 * @description 搜索地址
 */
export function searchAddress (address) {
  return request({
    url: '/place/search',
    method: 'get',
    params: {
      address
    }
  })
}
