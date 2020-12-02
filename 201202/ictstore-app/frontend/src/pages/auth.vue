<template>
  <div>
    <Header title="ICTSTORE 顔認証"></Header><br>

    <div class="body">
      <h2>顔認証の手順</h2><br><br>
      <ul>
        <li>カメラの枠内に顔を写す</li>
        <li>スペースキーを押下して顔画像を撮影する</li>
      </ul>
    </div>

    <div class="video-wrapper">
      <video ref="video" id="video" width="960" height="720" autoplay></video>
      <canvas id="canvas-for-boundingbox" width="960" height="720"></canvas>
    </div>
    <canvas id="canvas-for-capture" width="960" height="720"></canvas>

    <AuthDialog
      v-on:close="closeDialog"
      :dialog="authDialog"
      :faceDetectionResult="faceDetectionResult"
      :authResult="authResult"
    ></AuthDialog>

    <NormalDialog
      :dialog="authenticatingDialog"
      :title="authenticatingDialogTitle"
    ></NormalDialog>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthDialog from '@/components/AuthDialog'
import NormalDialog from '@/components/NormalDialog'
import config from '@/config/development.js'
import axios from 'axios'

export default {
  name: 'auth',
  components: {
    Header: Header,
    AuthDialog: AuthDialog,
    NormalDialog: NormalDialog
  },
  data () {
    return {
      // canvas element
      canvasForBoundingBox: {},
      contextForBoundingBox: {},
      canvasForCapture: {},
      contextForCapture: {},
      // auth & detect result
      faceDetectionResult: false,
      authResult: false,
      // dialog status
      authDialog: false,
      authenticatingDialog: false,
      authenticatingDialogTitle: '認証しています...',
      timeOfDisplaySuccessDialog: 2000
    }
  },
  computed: {
  },
  mounted () {
    // リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    this.playVideo()
    // スペースキー押下時の処理を追加
    document.addEventListener('keydown', this.keydownEvent)
    //  顔枠の描画を開始する
    this.drawFaceBoundingBox()
  },
  methods: {
    keydownEvent: function () {
      const keyName = event.key
      if (keyName === ' ' && !this.authDialog) {
        this.auth()
      } else if (keyName === ' ' && this.authDialog && !this.authResult) {
        this.closeDialog()
      }
    },
    playVideo: function () {
      // リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
      let video = document.getElementById('video')
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream
          video.play()
        })
      }
    },
    drawFaceBoundingBox: function () {
      // 顔枠を取得
      const path = 'http://localhost:5000/boundingbox'
      const data = { img: this.captureImgDataUrlWithoutHeaderFromVideo() }
      axios
        .post(path, data)
        .then((response) => {
          const data = response.data
          this.canvasForBoundingBox = document.getElementById('canvas-for-boundingbox')
          this.contextForBoundingBox = this.canvasForBoundingBox.getContext('2d')
          this.contextForBoundingBox.strokeStyle = 'rgb(0, 0, 255)'
          this.contextForBoundingBox.clearRect(0, 0, 960, 720)
          this.contextForBoundingBox.strokeRect(data.x, data.y, data.w, data.h)
          this.drawFaceBoundingBox()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    captureImgDataUrlWithoutHeaderFromVideo: function () {
      this.canvasForCapture = document.getElementById('canvas-for-capture')
      this.canvasForCaptureContext = this.canvasForCapture.getContext('2d')
      this.canvasForCaptureContext.drawImage(document.getElementById('video'), 0, 0, 960, 720)
      return this.canvasForCapture.toDataURL('image/jpeg').replace(/^.*,/, '')
    },
    auth: function () {
      this.authenticatingDialog = true
      const path = 'http://localhost:5000/auth'
      const data = {
        img: this.captureImgDataUrlWithoutHeaderFromVideo(),
        threshold: config.auth_threshold
      }
      axios.post(path, data)
        .then(response => {
          this.authenticatingDialog = false
          console.log(response.data)
          this.faceDetectionResult = response.data.facedetection_result
          this.authResult = response.data.auth_result
          const userId = this.authResult
            ? response.data.user_id : undefined
          this.openStore(userId)
          this.openDialog()
        })
        .catch(error => {
          console.log(error)
        })
    },
    openStore: function (userId) {
      // const path = 'http://localhost:8080/store/outside/enterUser'
      // const data = this.authResult
      //   ? {'authentication_status': 'success', 'user_id': userId}
      //   : {'authentication_status': 'failure'}
      // axios.post(path, data)
      //   .then(response => {
      //     console.log(response.data)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    openDialog: async function () {
      this.authDialog = true
      // 「認証成功」の場合は、指定秒数経過後にダイアログを閉じる
      if (this.authResult) {
        const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        await _sleep(this.timeOfDisplaySuccessDialog)
        this.closeDialog()
      }
    },
    closeDialog: function () {
      this.authDialog = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style-type: decimal;
}
#canvas-for-capture {
  display: none !important;
}
.video-wrapper canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.video-wrapper {
  position: relative;
  float: right;
}
.body {
  position: absolute;
}
</style>
