import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import PasteiImg from '@/pages/PasteImg'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/pasteimg',
      name: 'PasteImg',
      component: PasteiImg
    }
  ]
})
