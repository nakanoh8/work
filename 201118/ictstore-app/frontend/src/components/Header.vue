<template>
  <div class="hello">
    <h1>{{ title }}</h1>

    <v-btn
      color="primarydark"
      @click="moveAdminLoginPage()"
      v-if="this.$route.name === 'auth'"
    >
      管理者ログイン
    </v-btn>
    <v-btn
      color="primarydark"
      @click="moveAdminMenuPage()"
      v-if="this.$route.name !== 'auth'"
    >
      管理者メニュー
    </v-btn>
    <v-btn
      color="primarydark"
      @click="moveAuthPage()"
      v-if="this.$route.name !== 'auth'"
    >
      ホーム
    </v-btn>

  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      msg: 'Page Title'
    }
  },
  props: ['title'],
  methods: {
    moveAuthPage: function () {
      this.$router.push({
        name: 'auth'
      })
        .catch(error => {
          console.log(error)
        })
    },
    moveAdminMenuPage: function () {
      // this.$router.push({
      //   name: 'adminmenu'
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    moveAdminLoginPage: function () {
      // this.$router.push({
      //   name: 'adminlogin'
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
