import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import auth from '@/pages/auth'
import adminlogin from '@/pages/adminlogin'
import adminmenu from '@/pages/adminmenu'
import userinfo from '@/pages/userinfo'
import faceregist from '@/pages/faceregist'
import facepreview from '@/pages/facepreview'

Vue.use(Router)

export default new Router({
  // パス末尾へ'#'が追加されるのを防ぐ
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/auth',
      name: 'auth',
      component: auth
    },
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: adminlogin
    },
    {
      path: '/adminmenu',
      name: 'adminmenu',
      component: adminmenu
    },
    {
      path: '/userinfo/:id',
      name: 'userinfo',
      component: userinfo
    },
    {
      path: '/faceregist/:id',
      name: 'faceregist',
      component: faceregist
    },
    {
      path: '/facepreview/:id',
      name: 'facepreview',
      component: facepreview,
      props: true
    }
  ]
})
