<template>
  <div>
    <Header title="ICTSTORE 利用開始情報登録"></Header>
    <br>
    <div>
      <h2>利用開始情報登録（顔撮影）の手順</h2>
      <ul>
        <li>カメラの枠内に顔を写す</li>
        <li>スペースキーを押下して顔画像を撮影する</li>
      </ul>
    </div>

    <div class="canvas-wrapper">
      <!-- <video ref="video" id="video" width="640" height="480" autoplay></video> -->
      <img id="video" src="@/config/lennon-1.jpg" width="640" height="480">
      <canvas id="canvas" width="640" height="480"></canvas>
    </div>
    <canvas id="canvas-for-capture" width="640" height="480"></canvas>

    <AuthDialog
      v-on:close="closeFailureFaceDetectionDialog"
      :dialog="failureFaceDetectionDialog"
      :faceDetectionResult="faceDetectionResult"
    ></AuthDialog>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthDialog from '@/components/AuthDialog'
import axios from 'axios'

export default {
  name: 'faceregist',
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
      imgDataOnHeader: undefined,
      imgData: undefined,
      faceDetectionResult: false,
      failureFaceDetectionDialog: false
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
      if (event.key !== ' ') { return }
      if (!this.failureFaceDetectionDialog) {
        this.detectFaceInVideoCapture()
      } else {
        this.closeFailureFaceDetectionDialog()
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
    moveFacePreviewPage: function () {
      // NavigationDuplicatedエラー回避
      if (this.$route.name !== 'faceregist') { return }

      this.$router.push({
        name: 'facepreview',
        params: {
          id: this.$route.params.id,
          imgData: this.imgDataOnHeader
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    openFailureFaceDetectionDialog: function () {
      this.failureFaceDetectionDialog = true
    },
    closeFailureFaceDetectionDialog: function () {
      this.failureFaceDetectionDialog = false
    },
    detectFaceInVideoCapture: async function () {
      this.canvasForCapture = document.getElementById('canvas-for-capture')
      this.canvasForCaptureContext = this.canvasForCapture.getContext('2d')
      this.canvasForCaptureContext.drawImage(document.getElementById('video'), 0, 0, 640, 480)
      this.imgDataOnHeader = this.canvasForCapture.toDataURL('image/jpeg')
      this.imgData = this.imgDataOnHeader.replace(/^.*,/, '')

      const path = 'http://localhost:5000/facedetection'
      const data = { img: this.imgData }
      axios.post(path, data)
        .then(response => {
          response.data.faceDetectionResult
            ? this.moveFacePreviewPage()
            : this.openFailureFaceDetectionDialog()
        })
        .catch(error => {
          console.log(error)
        })
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
