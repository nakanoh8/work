<template>
  <div>
    <Header title="ICTSTORE 利用開始情報登録"></Header><br>

    <div class="body">
      <h2>登録画像プレビュー</h2><br><br>
      <p>この画像を登録して入店時の顔認証に利用します。</p>
      <p>よろしいですか？</p>
      <div class="btn">
        <v-btn @click="registFaceVectorAndMoveUserInfoPage()">
          登録する
        </v-btn>
        <v-btn @click="moveFaceRegistPage()">
            もう1度撮影する
        </v-btn>
      </div>
    </div>

    <canvas id="canvas" width="960" height="720"></canvas>

    <NormalDialog
      :dialog="faceRegistDialog"
      :title="faceRegistDialogTitle"
      :body="faceRegistDialogBody"
    ></NormalDialog>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthDialog from '@/components/AuthDialog'
import NormalDialog from '@/components/NormalDialog'
import axios from 'axios'

export default {
  name: 'facepreview',
  components: {
    Header: Header,
    AuthDialog: AuthDialog,
    NormalDialog: NormalDialog
  },
  props: {
    id: String,
    imgDataUrl: String
  },
  data () {
    return {
      imgDataUrlWithoutHeader: '',
      faceRegistDialog: false,
      faceRegistDialogTitle: '',
      faceRegistDialogBody: '',
      timeOfFaceRegistCompleteDialog: 2000
    }
  },
  computed: {
  },
  mounted () {
    let canvas = document.getElementById('canvas')
    let canvasContext = canvas.getContext('2d')
    let img = new Image()
    img.src = this.imgDataUrl
    img.onload = function () {
      canvasContext.drawImage(img, 0, 0, 960, 720)
    }

    this.imgDataUrlWithoutHeader = this.imgDataUrl.replace(/^.*,/, '')
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
      console.log('Run moveUserInfoPage()')
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
    regist: async function (faceVector) {
      console.log('Run regist()')
      // const path = `http://localhost:8080/storeInfo/users/${this.$route.params.id}/AuthenticationVector`
      // const data = {
      //   user_id: this.$route.params.id,
      //   auth_vector: faceVector
      //   }
      // await axios.post(path, data)
      //     .then(response => {
      //     console.log(response.data)
      //     })
      //     .catch(error => {
      //     console.log(error)
      //     })
    },
    getFaceVector: async function () {
      // 顔枠を取得
      const url = 'http://localhost:5000/facevector'
      const data = { image_dataurl: this.imgDataUrlWithoutHeader }
      const res = await axios.post(url, data).catch(error => console.log(error))
      console.log('### getFaceVector')
      console.log(typeof res.data.face_vector)
      console.log(res.data.face_vector)

      return res.data.face_vector
    },
    registFaceVectorAndMoveUserInfoPage: async function () {
      // 登録中ダイアログを表示
      this.faceRegistDialog = true
      this.faceRegistDialogTitle = '利用者情報を登録しています...'

      const faceVector = await this.getFaceVector()
      await this.regist(faceVector)

      // 登録完了ダイアログを表示(指定秒間)
      this.faceRegistDialogTitle = '[登録完了]'
      this.faceRegistDialogBody = '利用者情報を登録しました。2秒後にユーザ情報ページに戻ります。'
      const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      await _sleep(this.timeOfFaceRegistCompleteDialog)
      // 登録完了ダイアログを閉じる
      this.faceRegistDialog = false

      // UserInfoPageへ移動
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
