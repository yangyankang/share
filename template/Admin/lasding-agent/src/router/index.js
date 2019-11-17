import Vue from 'vue'
import Router from 'vue-router'

import PublicUserLayout from '@/layouts/PublicUserLayout'
// import BaseLayout from '@/layouts/BaseLayout'

Vue.use(Router)

const routes = [
  // {
  //   path: '/',
  //   name: 'HelloWorld',
  //   component: BaseLayout,
  //   children: [
  //     {
  //       path: '/abc',
  //       name: 'abc',
  //       component: () => import('@/views/home')
  //     }
  //   ]
  // },
  {
    path: '/user',
    name: 'user',
    meta: { title: '用户' },
    hidden: true,
    component: PublicUserLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/Login')
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  routes
})
