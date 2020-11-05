import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import auth from '@/pages/auth'

Vue.use(Router)

export default new Router({
  // パス末尾へ'#'が追加されるのを防ぐ
  mode: 'history', // ★★★追加★★★
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
    }
  ]
})
