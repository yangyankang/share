import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取商品类别列表
 */
export function GetCategory (params) {
  return request({
    url: '/category/find',
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
 * @description 创建商品类别
 */
export function createCategory (params) {
  return request({
    url: '/category/create',
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
 * @description 更新商品类别
 */
export function updateCategory (params) {
  return request({
    url: '/category/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} categoryId
 * @returns
 * @description 删除类别
 */
export function deleteCategory (categoryId) {
  return request({
    url: `/category/delete/${categoryId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取子类别
 */
export function GetSubcategory (params) {
  return request({
    url: '/category/subcategory/find',
    method: 'post',
    data: params
  })
}

export function createSubcategory (params) {
  return request({
    url: '/category/subcategory/create',
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
 * @description 更新字类信息
 */
export function updateSubcategory (params) {
  return request({
    url: '/category/subcategory/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} subcategoryId
 * @returns
 * @description 删除子类别
 */
export function deleteSubcategory (subcategoryId) {
  return request({
    url: `/category/subcategory/delete/${subcategoryId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取品牌列表
 */
export function GetBrands (params) {
  return request({
    url: '/brand/find',
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
 * @description 创建品牌
 */
export function createBrand (params) {
  return request({
    url: '/brand/create',
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
 * @description 删除品牌
 */
export function updateBrand (params) {
  return request({
    url: '/brand/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} brandId
 * @returns
 * @description 删除品牌
 */
export function deleteBrand (brandId) {
  return request({
    url: `/brand/delete/${brandId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取商家品牌
 */
export function GetTbBrand (params) {
  return request({
    url: '/tb/brand/find',
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
 * @description 创建商家品牌
 */
export function createTbBrand (params) {
  return request({
    url: '/tb/brand/create',
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
 * @description 更新商家品牌信息
 */
export function updateTbBrand (params) {
  return request({
    url: '/tb/brand/update',
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
 * @description 产品绑定
 */
export function tbBrandBind (params) {
  return request({
    url: '/tb/brand/bind',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @param {*} brandId
 * @returns
 * @description 删除商家品牌
 */
export function deleteTbBrand (brandId) {
  return request({
    url: `/tb/brand/delete/${brandId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取产品
 */
export function GetProduct (params) {
  return request({
    url: '/product/find',
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
 * @description 创建产品
 */
export function createProduct (params) {
  return request({
    url: '/product/create',
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
 * @description 更新产品
 */
export function updateProduct (params) {
  return request({
    url: '/product/update',
    method: 'post',
    data: params
  })
}

/**
 *
 *
 * @export
 * @returns
 * @description 删除产品
 */
export function deleteProduct (productId) {
  return request({
    url: `/product/delete/${productId}`,
    method: 'post'
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 * @description 获取商家店铺自有产品
 */
export function GetTbProducts (params) {
  return request({
    url: '/tb/product/find',
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
 * @description 创建商家自有产品
 */
export function createTbProduct (params) {
  return request({
    url: '/tb/product/create',
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
 * @description 更新商家自有产品
 */
export function updateTbProduct (params) {
  return request({
    url: '/tb/product/update',
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
export function TbBindProduct (params) {
  return request({
    url: '/tb/product/bind',
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
 * @description 删除商家绑定产品
 */
export function deleteTbProduct (params) {
  return request({
    url: '/tb/product/delete',
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
 * @description 获取策略可用产品
 */
export function GetStrategyProduct (params) {
  return request({
    url: '/tp/price/group/rule/product/valid/tree',
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
 * @description 获取已选规则产品
 */
export function usedRuleProduct (params) {
  return request({
    url: '/tp/price/group/rule/product/find',
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
 * @description 保存产品规则
 */
export function saveProductRule (params) {
  return request({
    url: '/tp/price/group/rule/product/create',
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
 * @description 保存自定义产品规则
 */
export function saveCustomProductRule (params) {
  return request({
    url: '/tp/partner/price/group/rule/product/create',
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
export function findCustomUsedProdcut (params) {
  return request({
    url: '/tp/partner/price/group/rule/product/find',
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
 * @description  查询自定义策略规则可使用的产品
 */
export function findCustomAllProduct (params) {
  return request({
    url: '/tp/partner/price/group/rule/product/valid/tree',
    method: 'post',
    data: params
  })
}
