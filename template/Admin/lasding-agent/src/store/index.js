import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import app from './modules/app'
import user from './modules/user'
import dict from './modules/dict'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    dict
  },
  getters
})

export default store
