import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/pages/auth'
import AdminLogin from '@/pages/AdminLogin'
import AdminMenu from '@/pages/AdminMenu'
import UserInfo from '@/pages/UserInfo'
import FaceRegist from '@/pages/FaceRegist'
import FacePreview from '@/pages/FacePreview'

Vue.use(Router)

export default new Router({
  // パス末尾へ'#'が追加されるのを防ぐ
  mode: 'history', // ★★★追加★★★
  routes: [
    {
      path: '/',
      name: 'auth',
      component: auth
    },
    {
      path: '/AdminLogin',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/AdminMenu',
      name: 'AdminMenu',
      component: AdminMenu
    },
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/FaceRegist',
      name: 'FaceRegist',
      component: FaceRegist
    },
    {
      path: '/FacePreview',
      name: 'FacePreview',
      component: FacePreview
    }
  ]
})
