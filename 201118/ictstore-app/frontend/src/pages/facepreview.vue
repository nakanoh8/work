<template>
  <div>
    <Header title="ICTSTORE 利用開始情報登録"></Header><br>

    <div class="body">
      <h2>登録画像プレビュー</h2><br><br>
      <p>この画像を登録して入店時の顔認証に利用します。</p>
      <p>よろしいですか？</p>
      <div class="btn">
        <v-btn @click="registImageAndMoveUserInfoPage()">
          登録する
        </v-btn>
        <v-btn @click="moveFaceRegistPage()">
            もう1度撮影する
        </v-btn>
      </div>
    </div>

    <canvas id="canvas" width="960" height="720"></canvas>¥
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthDialog from '@/components/AuthDialog'

export default {
  name: 'facepreview',
  components: {
    Header: Header,
    AuthDialog: AuthDialog
  },
  props: {
    id: String,
    imgStrWithHeader: String
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
    let canvas = document.getElementById('canvas')
    let canvasContext = canvas.getContext('2d')
    let img = new Image()
    img.src = this.imgStrWithHeader
    img.onload = function () {
      canvasContext.drawImage(img, 0, 0, 960, 720)
    }
  },
  methods: {
    moveFaceRegistPage: function () {
      this.$router.push({
        name: 'faceregist',
        params: {
          id: this.$route.params.id
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    moveUserInfoPage: function () {
      // this.$router.push({
      //   name: 'userinfo',
      //   params: {
      //     id: this.$route.params.id
      //   }
      // })
      // .catch(error => {
      //   console.log(error)
      // })
    },
    registImage: function(){
      let canvas = document.getElementById('canvas')
      let canvasContext = canvas.getContext('2d')
      canvasContext.drawImage(document.getElementById('video'), 0, 0, 960, 720)
      // const imgStr = canvas.toDataURL('image/jpeg')

      // const path = 'http://localhost:5000/regist*****************'
      // const data = { img: this.img }
      // axios.post(path, data)
      //     .then(response => {
      //     console.log(response.data)
      //     })
      //     .catch(error => {
      //     console.log(error)
      //     })
    },
    registImageAndMoveUserInfoPage: function () {
      this.registImage()
      this.moveUserInfoPage()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style-type: none;
}
.body {
  position: absolute;
}
.btn {
  margin-top: 50px;
}
#canvas {
  position: relative;
  float: right;
}
</style>
