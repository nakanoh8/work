<template>
  <v-app-bar color="primary accent-4" dark>
    <v-toolbar-title>
      {{ title }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div
      v-if="this.$route.name !== 'auth' && this.$route.name !== 'adminlogin'"
      class="mx-5"
    >
      ユーザID：{{ this.$store.state.userNo }}
    </div>
    <v-menu offsetY auto>
      <template v-slot:activator="{ on }">
        <v-toolbar-items>
          <v-btn text v-on="on">
            Menu<v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </v-toolbar-items>
      </template>

      <v-list>
        <v-subheader>Menu</v-subheader>
        <v-list-item
          @click="moveAdminLoginPage"
          v-if="this.$route.name === 'auth'">
          <v-list-item-icon class="ml-4">
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>管理者ログイン</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="moveAdminMenuPage"
          v-if="this.$route.name !== 'auth' && this.$route.name !== 'adminlogin'">
          <v-list-item-icon class="ml-4">
            <v-icon>mdi-menu</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>管理者メニュー</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="moveAuthPage"
          v-if="this.$route.name == 'adminlogin'">
          <v-list-item-icon class="ml-4">
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ホーム</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="logout"
          v-if="this.$route.name !== 'auth' && this.$route.name !== 'adminlogin'">
          <v-list-item-icon class="ml-4">
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-comtent>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item-comtent>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
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
      this.$router
        .push({
          name: 'auth'
        })
        .catch((error) => {
          console.log(error)
        })
    },
    moveAdminMenuPage: function () {
      if (this.$route.name !== 'adminmenu') {
        this.$router
          .push({
            name: 'adminmenu'
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    moveAdminLoginPage: function () {
      this.$router
        .push({
          name: 'adminlogin'
        })
        .catch((error) => {
          console.log(error)
        })
    },
    logout: function () {
      this.$store.dispatch('logout')
      this.moveAuthPage()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
/* .btn {
  display: block;
  margin: 0 0 0 auto;
} */
.title {
  float: left;
}
.header {
  overflow: hidden;
}
</style>
