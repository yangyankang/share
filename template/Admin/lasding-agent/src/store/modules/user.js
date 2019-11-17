import { login, userInfo, userMenu } from '@/api/auth'

import { getItem, setItem, rmItem } from '@/utils/storage'

const LSD_USER_TOKEN = 'LSD_USER_TOKEN'
const LSD_USER_AVATAR = 'LSD_USER_AVATAR'
const LSD_USER_USERNAME = 'LSD_USER_USERNAME'
const LSD_USER_USERINFO = 'LSD_USER_USERINFO'
const LSD_USER_NICKNAME = 'LSD_USER_NICKNAME'

var token = getItem(1, LSD_USER_TOKEN)
var avatar = getItem(1, LSD_USER_AVATAR)
var username = getItem(1, LSD_USER_USERNAME)
var UserInfo = getItem(1, LSD_USER_USERINFO)
var nickname = getItem(1, LSD_USER_NICKNAME)

const user = {
  state: {
    token: token || null,
    userInfo: UserInfo || {},
    avatar: avatar || '',
    username: username || '',
    nickname: nickname || '',
    userMenu: [],
    openpages: []
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_USERINFO (state, info) {
      state.userInfo = {...info}
    },
    SET_AVATAR (state, avatar) {
      state.avatar = avatar
    },
    SET_USERNAME (state, username) {
      state.username = username
    },
    SET_NICKNAME (state, nickname) {
      state.nickname = nickname
    },
    SET_USERMENU (state, menu) {
      state.userMenu = menu
    },
    UPDATE_OPENPAGES (state, pages) {
      state.openpages = [...pages]
    }
  },
  actions: {
    Login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(res => {
            let result = res.result
            commit('SET_TOKEN', result)
            setItem(1, LSD_USER_TOKEN, result)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    Logout ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        rmItem(1, LSD_USER_TOKEN)
        resolve()
      })
    },
    GetUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        userInfo()
          .then(res => {
            let result = res.result || {}
            commit('SET_USERINFO', result)
            commit('SET_AVATAR', result.avatar)
            commit('SET_USERNAME', result.username)
            commit('SET_NICKNAME', result.realname || result.username)
            setItem(1, LSD_USER_AVATAR, result.avatar)
            setItem(1, LSD_USER_USERNAME, result.username)
            setItem(1, LSD_USER_USERINFO, result)
            setItem(1, LSD_USER_NICKNAME, result.realname || result.username)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetUserMenu ({ commit }) {
      return new Promise((resolve, reject) => {
        userMenu()
          .then(res => {
            const {
              // allAuth,
              // auth,
              menu
            } = res.result
            commit('SET_USERMENU', menu)
            resolve(menu)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addPage ({ commit, state }, page) {
      const {
        openpages
      } = state
      let has = openpages.find(item => item.path === page.path)
      const {
        path,
        query,
        meta,
        name,
        hash,
        fullPath,
        params
      } = page
      let tmpPage = {
        path,
        query,
        meta,
        name,
        hash,
        fullPath,
        params
      }
      const filterPaths = ['/404', '/503']
      if (has) {
        Object.assign(has, tmpPage)
      } else {
        if (filterPaths.indexOf(page.path) === -1) {
          openpages.push(tmpPage)
        }
      }
      commit('UPDATE_OPENPAGES', openpages)
    },
    closePage ({ commit, state }, index) {
      const {
        openpages
      } = state
      if (index !== -1) {
        openpages.splice(index, 1)
      }
      commit('UPDATE_OPENPAGES', openpages)
    }
  }
}

export default user
