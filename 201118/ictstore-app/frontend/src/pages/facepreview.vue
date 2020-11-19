<template>
  <div>
    <Header title="ICTSTORE 利用開始情報登録"></Header>
    <br>
    <div>
      <h2>登録画像プレビュー</h2>
      <br>
      <h5>この画像を登録して入店時の顔認証に利用します。</h5>
      <h5>よろしいですか？</h5>
    </div>

    <v-btn
        color="primarydark"
        @click="registImageAndMoveUserInfoPage()"
        >
        登録する
    </v-btn>
     <v-btn
        color="primarydark"
        @click="moveFaceRegistPage()"
    >
        もう1度撮影する
    </v-btn>

    <canvas id="canvas" width="640" height="480"></canvas>

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
    id: undefined,
    imgData: undefined
  },
  data () {
    return {
      canvas: {},
      canvasContext: {},
      img: undefined
    }
  },
  computed: {
  },
  mounted () {
    const canvas = document.getElementById('canvas')
    const canvasContext = canvas.getContext('2d')
    const img = new Image()
    img.src = this.imgData
    img.onload = function () {
      canvasContext.drawImage(img, 0, 0, 640, 480)
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
    registImage: function () {
      this.canvas = document.getElementById('canvas-for-capture')
      this.canvasContext = this.canvas.getContext('2d')
      this.canvasContext.drawImage(document.getElementById('video'), 0, 0, 640, 480)
      this.img = this.canvas.toDataURL('image/jpeg')

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
#canvas {
  position: relative;
}
</style>
