import { GetToken } from '@/api/file'
const app = {
  state: {
    themeColor: '#002140',
    themeType: '',
    asideTheme: '#001529',
    navTextColor: 'rgba(255, 255, 255, 0.65)',
    navTextActiveColor: '#FFF',
    showMenu: true,
    fixedHeader: true,
    fixedMenu: true,
    qniuToken: ''
  },
  mutations: {
    SET_SHOW_MENU (state, bool) {
      state.showMenu = bool
    },
    SET_QINIU_TOKEN (state, token) {
      state.qniuToken = token
    }
  },
  actions: {
    toggleShowMenu ({ commit }, val) {
      commit('SET_SHOW_MENU', val)
    },
    GetQniuToken ({ commit }) {
      return new Promise((resolve, reject) => {
        GetToken()
          .then(res => {
            commit('SET_QINIU_TOKEN', res.result)
            resolve(res.result)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default app
