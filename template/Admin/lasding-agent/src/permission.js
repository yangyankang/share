
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// Progress 进度条样式

import { Message } from 'element-ui'

import { generateRoutes } from './router/generateRotues'

const whiteList = [
  '/user/login',
  '/404'
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/user/login') {
      next({ path: '/' })
    } else {
      if (store.getters.userMenu.length > 0) {
        next()
        store.dispatch('addPage', to)
      } else {
        store.dispatch('GetUserMenu')
          .then(userMenu => {
            let routes = generateRoutes(userMenu)
            router.addRoutes(routes)
            next({...to})
          })
          .catch(err => {
            Message.error(err.message)
            store.dispatch('Logout')
          })
      }
    }
  } else {
    // 是否在白名单之内
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/user/login')
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
