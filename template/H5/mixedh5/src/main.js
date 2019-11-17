import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/reset.css'
import onepx from './directives/onepx'
import Bridge from './utils/JsBridge'

import '@/icons' // svg icon

Vue.use(onepx) // 解决一像素问题


Vue.config.productionTip = false

Vue.prototype.$bridge = Bridge

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
