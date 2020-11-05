<template>
  <div>
    <Header title="ICTSTORE ICTSTORE ICTSTORE"></Header>
    <div>
      <h2>顔認証の手順</h2>
      <ul>
        <li>カメラの枠内に顔を写す</li>
        <li>スペースキーを押下して顔画像を撮影する</li>
      </ul>
    </div>
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
    </div>

  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'auth',
  components: {
    'Header': Header
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      video: {}
    }
  },
  mounted () {
    // let video = document.getElementById('video');
    // console.log(video)
    // // getUserMedia()でカメラ映像の取得
    // console.log(navigator.mediaDevices)
    // let media = navigator.mediaDevices.getUserMedia({ video: true });
    // //リアルタイム再生（ストリーミング）を行うためにビデオタグに流し込む
    // media.then((stream) => {
    //     video.srcObject = stream;
    // });
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream
        this.video.play()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
} */
li {
  list-style-type: decimal
}
/* a {
  color: #42b983;
} */
</style>
