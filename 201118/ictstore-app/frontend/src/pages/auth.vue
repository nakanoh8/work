<template>
  <div>
    <Header title="ICTSTORE 顔認証"></Header>
    <br>
    <div>
      <h2>顔認証の手順</h2>
      <ul>
        <li>カメラの枠内に顔を写す</li>
        <li>スペースキーを押下して顔画像を撮影する</li>
      </ul>
    </div>

    <div class="canvas-wrapper">
      <!-- <video ref="video" id="video" width="640" height="480" autoplay></video> -->
      <img id="video" src="@/config/lennon-2.jpg" width="640" height="480">
      <canvas id="canvas" width="640" height="480"></canvas>
    </div>
    <canvas id="canvas-for-capture" width="640" height="480"></canvas>

    <AuthDialog
      v-on:close="closeDialog"
      :dialog="dialog"
      :faceDetectionResult="faceDetectionResult"
      :authResult="authResult"
    ></AuthDialog>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthDialog from '@/components/AuthDialog'
import config from '@/config/development.js'
import axios from 'axios'

export default {
  name: 'auth',
  components: {
    Header: Header,
    AuthDialog: AuthDialog
  },
  data () {
    return {
      video: {},
      canvas: {},
      canvasContext: {},
      canvasForCapture: {},
      canvasForCaptureContext: {},
      img: undefined,
      faceDetectionResult: false,
      authResult: false,
      dialog: false,
      timeOfDisplaySuccessDialog: 2000
    }
  },
  mounted () {
    // リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    // this.video = this.$refs.video;
    // this.video = document.getElementById('video')
    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    //     this.video.srcObject = stream
    //     this.video.play()
    //   })
    // }

    // スペースキー押下時の処理を追加
    document.addEventListener('keydown', (event) => {
      const keyName = event.key
      if (keyName === ' ' && !this.dialog) {
        this.auth()
      } else if (keyName === ' ' && this.dialog && !this.authResult) {
        this.closeDialog()
      }
    })

    // this.video.addEventListener(
    //   'timeupdate',
    //   function () {
    //     this.canvasForCapture = document.getElementById('canvas-for-capture')
    //     this.canvasForCapture.strokeStyle = '#FF0000'
    //     this.canvasForCaptureContext = this.canvasForCapture.getContext('2d')
    //     this.canvasForCaptureContext.drawImage(document.getElementById('video'), 0, 0, 640, 480)
    //     this.img = this.canvasForCapture.toDataURL('image/jpeg').replace(/^.*,/, '')

    //     // 顔枠を取得
    //     const path = 'http://localhost:5000/boundingbox'
    //     const data = { img: this.img }
    //     axios
    //       .post(path, data)
    //       .then((response) => {
    //         const data = response.data
    //         this.canvas = document.getElementById('canvas')
    //         this.canvasContext = this.canvas.getContext('2d')
    //         this.canvasContext.clearRect(0, 0, 640, 480)
    //         this.canvasContext.strokeRect(data.x, data.y, data.w, data.h)
    //       })
    //       .catch((error) => {
    //         console.log(error)
    //       })
    //   },
    //   true
    // )
  },
  methods: {
    auth: function () {
      this.canvasForCapture = document.getElementById('canvas-for-capture')
      this.canvasForCaptureContext = this.canvasForCapture.getContext('2d')
      this.canvasForCaptureContext.drawImage(document.getElementById('video'), 0, 0, 640, 480)
      this.img = this.canvasForCapture.toDataURL('image/jpeg').replace(/^.*,/, '')

      const path = 'http://localhost:5000/auth'
      const data = { img: this.img, threshold: config.auth_threshold }
      axios.post(path, data)
        .then(response => {
          console.log(response.data)
          this.faceDetectionResult = response.data.faceDetectionResult
          this.authResult = response.data.authResult
          this.openDialog()
        })
        .catch(error => {
          console.log(error)
        })
    },
    openStore: function (customerId) {
      const path = 'http://localhost:8080/store/outside/entercustomer'
      const data = {
        'authentication_status': 'success',
        'customer_id': customerId
      }
      axios.post(path, data)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    openDialog: async function () {
      this.dialog = true

      // 「認証成功」の場合は、指定秒数経過後にダイアログを閉じる
      if (this.authResult) {
        const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        await _sleep(this.timeOfDisplaySuccessDialog)
        this.closeDialog()
      }
    },
    closeDialog: function () {
      this.dialog = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style-type: decimal;
}
.canvas-wrapper canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.canvas-wrapper canvas {
  position: absolute;
}
.canvas-wrapper {
  position: relative;
}
#canvas-for-capture {
  display: none !important;
}
</style>
