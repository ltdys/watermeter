// 前端路由权限控制
import router from '@/router/router.js'

var localStorage = window.localStorage

router.beforeEach((to, from, next) => {
  var storage = localStorage.getItem('USER_INFO')
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (storage) {  // 通过storage判断是否登录
      next()
    } else {
      // next({ path: '/team/login',replace: true})
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})
