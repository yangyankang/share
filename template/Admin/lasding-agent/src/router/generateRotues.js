
export function generateRoutes (data) {
  let homePagePath = data[0].children && data[0].children.length > 0
    ? data[0].children[0].path : data[0].path
  let routes = [
    {
      path: '/',
      name: 'home',
      meta: { title: '首页' },
      redirect: homePagePath,
      component: resolve => require(['@/layouts/BaseLayout'], resolve),
      children: [
        ...subRoutes(data)
      ]
    },
    {
      path: '/404',
      name: '404',
      meta: {title: '没有找到'},
      component: () => import('@/views/404'),
      hidden: true
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
  return routes
}

/**
 *
 *
 * @param {*} data
 * @returns
 * @description 生成子路由
 */
function subRoutes (data) {
  let routes = []
  for (var item of data) {
    let component = ''
    if (item.component) {
      if (item.component.indexOf('layouts') !== -1) {
        component = item.component
      } else {
        component = 'views/' + item.component
      }
    } else {
      continue
    }

    let route = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: resolve => require(['@/' + component], resolve),
      hidden: item.hidden,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList
      }
    }

    if (item.children && item.children.length > 0) {
      route.children = [ ...subRoutes(item.children) ]
    }
    if (item.route === '1') {
      routes.push(route)
    }
  }
  return routes
}
