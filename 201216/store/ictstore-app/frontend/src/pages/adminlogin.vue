<template>
  <div>
    <Header title="管理者としてログイン"></Header>
    <v-alert
      dense
      outlined
      type="error"
      class="mx-10"
      v-if="hasError"
    >
      ログインに失敗しました。
    </v-alert>
    <v-container>
      <v-form ref="loginForm">
        <v-row justify="center">
          <v-col cols="6">
            <v-text-field
              v-model="loginForm.userNo"
              label="ユーザID"
              :rules="[required]"
              clearable
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="6">
            <v-text-field
              v-model="loginForm.password"
              label="パスワード"
              type="password"
              autocomplete="on"
              :rules="[required]"
              clearable
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="1">
            <v-btn @click="login()" color="primary"> ログイン </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import config from '../config/development'
import axios from 'axios'
export default {
  name: 'adminlogin',
  components: {
    Header: Header
  },
  data: function () {
    return {
      loginForm: {
        userNo: '',
        password: ''
      },
      hasError: false,
      required: (value) => !!value || '入力必須です。'
    }
  },
  methods: {
    // login: function () {
    //   this.$store.dispatch('login', {
    //     'userNo': this.loginForm.userNo,
    //     'password': this.loginForm.password,
    //     'isManager': true}).then(result => {
    //     if (result) {
    //       // ログイン成功
    //       this.$router
    //         .push({
    //           name: 'adminmenu'
    //         })
    //         .catch((error) => {
    //           console.log(error)
    //         })
    //     } else {
    //       // ログイン失敗
    //       this.hasError = true
    //     }
    //   })
    // },
    login: function () {
      this.hasError = false
      if (this.$refs.loginForm.validate()) {
        const url = `${config.store_info_api_url}/storeInfo/users/user_no/${this.loginForm.userNo}`
        axios
          .get(url)
          .then((response) => {
            for (var key in response.data) {
              const data = response.data[key]
              this.$store.dispatch('login', {
                'userNo': this.loginForm.userNo,
                'password': this.loginForm.password,
                'isManager': data.ismanager}).then(result => {
                if (result) {
                  // ログイン成功
                  this.$router
                    .push({
                      name: 'adminmenu'
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                } else {
                  // ログイン失敗
                  this.hasError = true
                }
              })
              break
            }
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
