<template>
  <div>
    <Header title="ICTSTORE 利用開始情報登録"></Header><br>

    <div class="body">
      <h2>利用開始情報登録（顔撮影）の手順</h2><br><br>
      <ul>
        <li>カメラの枠内に顔を写す</li>
        <li>スペースキーを押下して顔画像を撮影する</li>
      </ul><br>
    </div>

    <div class="video-wrapper">
      <video ref="video" id="video" width="960" height="720" autoplay></video>
      <canvas id="canvas-for-boundingbox" width="960" height="720"></canvas>
    </div>
    <canvas id="canvas-for-capture" width="960" height="720"></canvas>

    <AuthDialog
      v-on:close="closeFailureFaceDetectionDialog"
      :dialog="failureFaceDetectionDialog"
      :faceDetectionResult="faceDetectionResult"
    ></AuthDialog>

    <NormalDialog
      :dialog="faceDetectingDialog"
      :title="faceDetectingDialogTitle"
    ></NormalDialog>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthDialog from '@/components/AuthDialog'
import NormalDialog from '@/components/NormalDialog'
import axios from 'axios'

export default {
  name: 'faceregist',
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
      // detect result
      faceDetectionResult: false,
      // dialog status
      failureFaceDetectionDialog: false,
      faceDetectingDialog: false,
      faceDetectingDialogTitle: '顔を検出しています...'
    }
  },
  mounted () {
    // リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    this.playVideo()
    // スペースキー押下時の処理を追加
    document.addEventListener('keydown', this.keydownEvent)
    //  顔枠の描画を開始する
    // this.video.addEventListener('timeupdate', this.timeUpdateEvent, true)
    this.drawFaceBoundingBox()
  },
  methods: {
    playVideo: function () {
      // リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
      // let video = this.$refs.video
      let video = document.getElementById('video')
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream
          video.play()
        })
      }
    },
    moveFacePreviewPage: function (imgDataUrl) {
      // NavigationDuplicatedエラー回避
      if (this.$route.name !== 'faceregist') { return }
      // 既存の'keydown'イベントを削除
      document.removeEventListener('keydown', this.keydownEvent)
      // カメラを停止
      let stream = document.getElementById('video').srcObject
      let tracks = stream.getTracks()
      tracks.forEach(function (track) {
        track.stop()
      })
      this.$router.push({
        name: 'facepreview',
        params: {
          id: this.$route.params.id,
          imgDataUrl: imgDataUrl
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    keydownEvent: function (event) {
      if (event.key !== ' ') { return }
      console.log('Keydown in FaceregistPage')
      if (!this.failureFaceDetectionDialog) {
        this.startFaceRegist()
      } else {
        this.closeFailureFaceDetectionDialog()
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
          if (this.canvasForBoundingBox === null) return
          this.contextForBoundingBox = this.canvasForBoundingBox.getContext('2d')
          this.contextForBoundingBox.clearRect(0, 0, 960, 720)
          this.contextForBoundingBox.strokeStyle = 'rgb(0, 0, 255)'
          this.contextForBoundingBox.strokeRect(data.x, data.y, data.w, data.h)

          this.drawFaceBoundingBox()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    captureImgDataUrlFromVideo: function () {
      this.canvasForCapture = document.getElementById('canvas-for-capture')
      this.contextForCapture = this.canvasForCapture.getContext('2d')
      this.contextForCapture.drawImage(document.getElementById('video'), 0, 0, 960, 720)
      return this.canvasForCapture.toDataURL('image/jpeg')
    },
    captureImgDataUrlWithoutHeaderFromVideo: function () {
      this.canvasForCapture = document.getElementById('canvas-for-capture')
      this.contextForCapture = this.canvasForCapture.getContext('2d')
      this.contextForCapture.drawImage(document.getElementById('video'), 0, 0, 960, 720)
      return this.canvasForCapture.toDataURL('image/jpeg').replace(/^.*,/, '')
    },
    openFailureFaceDetectionDialog: function () {
      this.failureFaceDetectionDialog = true
    },
    closeFailureFaceDetectionDialog: function () {
      this.failureFaceDetectionDialog = false
    },
    faceBoundingBox: async function (imgDataUrlWithoutHeader) {
      // 顔枠を取得
      const url = 'http://localhost:5000/boundingbox'
      const data = { img: imgDataUrlWithoutHeader }
      const res = await axios.post(url, data).catch(error => console.log(error))

      return res.data
    },
    containsFaceOn: async function (imgDataUrlWithoutHeader) {
      const url = 'http://localhost:5000/facedetection'
      const data = { img: imgDataUrlWithoutHeader }
      const res = await axios.post(url, data).catch(error => console.log(error))

      return res.data.facedetection_result
    },
    startFaceRegist: async function () {
      // 顔検出中ダイアログを表示
      this.faceDetectingDialog = true

      // キャプチャ用Canvasの画像に顔枠を描画
      const imgDataUrlWithoutHeader = this.captureImgDataUrlWithoutHeaderFromVideo()
      const faceBoundingBox = await this.faceBoundingBox(imgDataUrlWithoutHeader)
      this.contextForCapture.strokeStyle = 'rgb(0, 0, 255)'
      this.contextForCapture.strokeRect(
        faceBoundingBox.x,
        faceBoundingBox.y,
        faceBoundingBox.w,
        faceBoundingBox.h
      )
      const imgDataUrlAftDrawFaceBB = this.captureImgDataUrlFromVideo()
      const imgDataUrlWithoutHeaderAftDrawFaceBB = imgDataUrlAftDrawFaceBB.replace(/^.*,/, '')

      // 検出成功：FacePreviewPageに遷移
      // 検出失敗：検出失敗ダイアログを表示
      const detectResult = await this.containsFaceOn(imgDataUrlWithoutHeaderAftDrawFaceBB)

      detectResult
        ? this.moveFacePreviewPage(imgDataUrlAftDrawFaceBB)
        : this.openFailureFaceDetectionDialog()

      // 顔検出中ダイアログを閉じる
      this.faceDetectingDialog = false
    },
    // ローカルへのダウンロード処理(※取得画像確認用)
    downloadImageToLocal: function (imgDataUrl) {
      let dlLink = document.createElement('a')
      dlLink.href = imgDataUrl
      dlLink.download = 'test.jpg'
      dlLink.click()
      dlLink.remove()
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
