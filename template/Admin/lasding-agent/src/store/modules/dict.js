
import { getDictItems } from '@/api/system'
import { GetSubcategory } from '@/api/product'

export const FIX_LEVEL = 'fix_level'
export const TP_PRICE_GROUP_MODE = 'tp_price_group_mode'
export const WOM_ORDER_TYPE = 'wom_order_type'
export const WOM_REPAIR_TYPE = 'wom_repair_type'
export const WOM_REPAIR_MODE = 'wom_repair_mode'
export const WOM_STATUS = 'wom_status'
export const WOM_FLOW_STATUS = 'wom_flow_status'
export const WOM_SOURCE_TYPE = 'wom_source_type'
export const TECH_GROUP_SETTLE_TYPE = 'group_settle_type'
export const WOM_PLAN_SLOT = 'wom_plan_slot'
export const WOM_REFUSE_TYPE = 'wom_refuse_type'
export const PAYMENT_PERIOD = 'payment_period'
export const TECH_TYPE = 'tech_type'
export const WOM_ORDER_REMARK_TYPE = 'wom_order_remark_type'
export const WOM_COMMENT_AUTH = 'wom_comment_auth'
export const PRICE_STRATEY_TYPES = 'price_stratey_types'
export const WOM_COST_STATUS = 'wom_cost_status'
export const PARTNER_TYPES = 'partner_types'
export const SHOP_TYPES = 'shop_type'
export const PARTNER_PAY_TYPES = 'partner_pay_types'
export const PAY_ACCOUNT_TYPES = 'pay_account_types'
export const SUBCATEGORYS = 'subcategorys'

const dict = {
  state: {
    [FIX_LEVEL]: [],
    [TP_PRICE_GROUP_MODE]: [],
    [WOM_ORDER_TYPE]: [],
    [WOM_REPAIR_TYPE]: [],
    [WOM_REPAIR_MODE]: [],
    [WOM_STATUS]: [],
    [WOM_FLOW_STATUS]: [],
    [WOM_SOURCE_TYPE]: [],
    [TECH_GROUP_SETTLE_TYPE]: [],
    [WOM_PLAN_SLOT]: [],
    [WOM_REFUSE_TYPE]: [],
    [PAYMENT_PERIOD]: [],
    [TECH_TYPE]: [],
    [WOM_ORDER_REMARK_TYPE]: [],
    [WOM_COMMENT_AUTH]: [],
    [PRICE_STRATEY_TYPES]: [],
    [WOM_COST_STATUS]: [],
    [PARTNER_TYPES]: [],
    [SHOP_TYPES]: [],
    [PARTNER_PAY_TYPES]: [],
    [PAY_ACCOUNT_TYPES]: [],
    [SUBCATEGORYS]: []
  },
  mutations: {
    ['SET_' + FIX_LEVEL] (state, list) {
      state[FIX_LEVEL] = [...list]
    },
    SET_DICT (state, action) {
      state[action.type] = [...action.data]
    },
    SET_SUBCATEGORYS (state, list) {
      state[SUBCATEGORYS] = [...list]
    }
  },
  actions: {
    ['Get_' + FIX_LEVEL] ({ commit }) {
      return new Promise((resolve, reject) => {
        getDictItems(FIX_LEVEL)
          .then(res => {
            commit('SET_' + FIX_LEVEL, res.result)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetDictItem ({ commit }, type) {
      return new Promise((resolve, reject) => {
        getDictItems(type)
          .then(res => {
            res.result.sort((a, b) => a.sortOrder - b.sortOrder)
            commit('SET_DICT', {
              type,
              data: res.result || []
            })
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetSubcategory ({ commit }) {
      return new Promise((resolve, reject) => {
        let params = {
          page: {
            pageSize: 1e5,
            pageNum: 1
          }
        }
        GetSubcategory(params)
          .then(res => {
            const result = res.result || {}
            commit('SET_SUBCATEGORYS', (result.list || []))
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default dict
