<template>
  <div>
    <Header title="管理者メニュー"></Header>
    <v-container>
      <v-row justify="center">
        <v-col cols="4">
          <v-btn @click="moveBasicInfo()" color="primary" large>
            基本情報登録
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="4">
          <v-btn @click="moveUserInfo()" color="primary" large>
            利用開始情報登録
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'adminmenu',
  components: {
    Header: Header
  },
  data: function () {
    return {}
  },
  methods: {
    moveBasicInfo: function () {
      console.log('未実装')
    },
    moveUserInfo: function () {
      this.$router
        .push({
          name: 'userinfo'
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
.v-btn {
  width: 300px;
}
</style>
