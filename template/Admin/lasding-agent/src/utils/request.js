import axios from 'axios'

import store from '@/store'

const instance = axios.create({
  baseURL: '/jeecg-boot/fastking',
  timeout: 150000
})

instance.interceptors.request.use(function (config) {
  if (store.getters.token) {
    config.headers.common['X-Access-Token'] = store.getters.token
  }

  if (config.method.toLocaleLowerCase === 'get') {
    config.params = {
      _t: Date.now(),
      ...config.params
    }
  }

  return config
}, function (err) {
  return Promise.reject(err)
})

instance.interceptors.response.use(function (response) {
  let data = response.data
  if (data.code === 200) {
    return data
  } else {
    if (data.code === 401) {
      store.dispatch('Logout')
      setTimeout(function () {
        window.location.reload()
      }, 2000)
    }
    return Promise.reject(data)
  }
}, function (err) {
  return Promise.reject(err)
})

export default instance
