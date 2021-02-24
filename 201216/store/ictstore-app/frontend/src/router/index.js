import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import auth from '@/pages/auth'
import adminlogin from '@/pages/adminlogin'
import adminmenu from '@/pages/adminmenu'
import userinfo from '@/pages/userinfo'
import faceregist from '@/pages/faceregist'
import facepreview from '@/pages/facepreview'
import Store from '@/store/index.js'

Vue.use(Router)

const router = new Router({
  // パス末尾へ'#'が追加されるのを防ぐ
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: { isPublic: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: auth,
      meta: { isPublic: true }
    },
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: adminlogin,
      meta: { isPublic: true }
    },
    {
      path: '/adminmenu',
      name: 'adminmenu',
      component: adminmenu
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: userinfo
    },
    {
      path: '/faceregist/:id',
      name: 'faceregist',
      component: faceregist,
      props: true
    },
    {
      path: '/facepreview/:id',
      name: 'facepreview',
      component: facepreview,
      props: true
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(page => page.meta.isPublic) || Store.state.userNo) {
//     next()
//   } else {
//     next('/adminlogin')
//   }
// })

export default router
