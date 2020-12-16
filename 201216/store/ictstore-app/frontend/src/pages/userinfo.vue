<template>
  <div>
    <Header title="ユーザ検索"></Header>
    <v-alert
      dense
      outlined
      type="error"
      class="mx-10"
      v-if="searched && userInfo.userNo == ''"
    >
      対象のユーザは登録されておりません。
    </v-alert>
    <v-container>
      <v-form ref="searchForm">
        <v-row justify="center">
          <v-col cols="6">
            <v-text-field
              v-model="searchForm.userNo"
              label="ユーザ番号"
              :rules="[required]"
              clearable
            >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn @click="search()" color="primary"> 検索 </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-container v-if="searched && userInfo.userNo != ''" elevation-4>
      <v-row>
        <v-col> ユーザ情報 </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">ユーザ番号：</v-col>
        <v-col cols="3">{{ userInfo.userNo }}</v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">利用者名：</v-col>
        <v-col cols="3">{{ userInfo.userName }}</v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">メールアドレス：</v-col>
        <v-col cols="3">{{ userInfo.userEmail }}</v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">利用開始情報：</v-col>
        <v-col cols="3">{{ userInfo.startedInfo }}</v-col>
      </v-row>
      <v-row class="mt-3" justify="center">
        <v-col cols="3">
          <v-btn @click="moveFaceRegist()" color="primary">
            <span v-if="userInfo.registerd">利用開始情報を再登録する</span>
            <span v-else>利用開始情報を登録する</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import config from '../config/development'
import axios from 'axios'
export default {
  name: 'userinfo',
  components: {
    Header: Header
  },
  data: function () {
    return {
      searchForm: {
        userNo: ''
      },
      userInfo: {
        userId: '',
        userNo: '',
        userName: '',
        userEmail: '',
        startedInfo: '',
        registerd: false
      },
      searched: false,
      required: (value) => !!value || '入力必須です。'
    }
  },
  created: function () {
    if (this.$route.query.userNo != null) {
      this.searchForm.userNo = this.$route.query.userNo
      this.search()
    }
  },
  methods: {
    // for debug
    // search: function () {
    //   this.searched = false
    //   this.userInfo = {
    //     userId: 'userId',
    //     userNo: 'userNo',
    //     userName: 'userName',
    //     userEmail: 'userEmail',
    //     startedInfo: '登録されていません。',
    //     registerd: false
    //   }
    //   this.searched = true
    // },
    search: function () {
      if (this.$refs.searchForm.validate()) {
        this.searched = false
        // 検索結果クリア
        this.userInfo = {
          userId: '',
          userNo: '',
          userName: '',
          userEmail: '',
          startedInfo: '',
          registerd: false
        }

        // ユーザ検索
        let url = `${config.store_info_api_url}/storeInfo/users/user_no/${this.searchForm.userNo}`
        axios
          .get(url)
          .then((response) => {
            for (var key in response.data) {
              const data = response.data[key]
              this.userInfo.userId = data.user_id
              this.userInfo.userNo = data.user_no
              this.userInfo.userName = data.user_name
              this.userInfo.userEmail = data.user_email

              if (data.vectorInfoList && data.vectorInfoList.length) {
                // 認証ベクトルあり
                var minDate = ''
                data.vectorInfoList.forEach(function (e) {
                  if (!minDate || minDate > e.createdAt) {
                    minDate = e.createdAt
                  }
                })
                this.userInfo.startedInfo = `登録済 ${minDate}`
                this.userInfo.registerd = true
              } else {
                // 認証ベクトルなし
                this.userInfo.startedInfo = '登録されていません。'
              }
              break
            }
          }).catch((error) => {
            console.log(error)
          })

        this.searched = true
      }
    },
    moveFaceRegist: function () {
      this.$router
        .push({
          name: 'faceregist',
          params: {
            userId: this.userInfo.userId,
            userNo: this.userInfo.userNo
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
