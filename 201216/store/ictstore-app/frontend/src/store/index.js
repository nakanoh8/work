import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config/development'
import jsSHA from 'jssha'

Vue.use(Vuex)

let salt = 'R4/6VhouhFs@'

export default new Vuex.Store({
  state: {
    userNo: ''
  },
  mutations: {
    updateUser (state, user) {
      state.userNo = user.userNo
    }
  },
  actions: {
    login (context, user) {
      // 管理者ではない場合、認証失敗
      if (!user.isManager) {
        return false
      }
      // eslint-disable-next-line new-cap
      const shaObj = new jsSHA('SHA-256', 'TEXT')
      shaObj.update(user.password)
      shaObj.update(salt)
      const hash = shaObj.getHash('HEX')
      // ハッシュ値が一致しない場合、認証失敗
      if (hash !== config.admin_password) {
        return false
      }
      context.commit('updateUser', user)
      return true
    },
    logout (context) {
      context.commit('updateUser', {'userNo': ''})
    }
  },
  modules: {}
})
