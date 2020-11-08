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
    <div class="canvas-wrapper">
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <canvas id="canvas" width="640" height="480"></canvas>
    </div>
    <canvas id="canvas-for-capture" width="640" height="480"></canvas>
  </div>
</template>

<script>
import Header from "@/components/Header";
import axios from "axios";

export default {
  name: "auth",
  components: {
    Header: Header,
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      video: {},
      canvas: {},
      canvasContext: {},
      canvasForCapture: {},
      canvasForCaptureContext: {},
      img: undefined
    };
  },
  mounted() {
    //リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
    // this.video = this.$refs.video;
    this.video = document.getElementById("video");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }

    //スペースキー押下時の処理を追加
    document.addEventListener("keydown", (event) => {
      const keyName = event.key;
      if (keyName === " ") {
        this.auth();
      }
    });

    // this.canvasForCapture = document.getElementById("canvas-for-capture");
    // this.canvasForCapture.setAttribute("width", this.video.width);
    // this.canvasForCapture.setAttribute("height", this.video.height);
    // this.canvasForCapture.strokeStyle = "#FF0000";
    // this.canvasForCaptureContext = this.canvasForCapture.getContext("2d");
    this.video.addEventListener(
        'timeupdate',
        function () {
            this.canvasForCapture = document.getElementById("canvas-for-capture");
            this.canvasForCapture.strokeStyle = "#FF0000";
            this.canvasForCaptureContext = this.canvasForCapture.getContext("2d");
            this.canvasForCaptureContext.drawImage(document.getElementById("video"), 0, 0, 640, 480);
            this.img = this.canvasForCapture.toDataURL("image/jpeg").replace(/^.*,/, "")
            // console.log(this.img)
            const path = "http://localhost:3000/face_bb";
            const data = {
              img: this.img,
            };
            // console.log(imgBase64)
            axios
              .post(path, data)
              .then((response) => {
                const data = response.data;
                // console.log("####### response.data")
                // console.log(response.data)

                this.canvas = document.getElementById("canvas");
                this.canvas.strokeStyle = "#FF0000";
                this.canvasContext = this.canvas.getContext("2d");
                this.canvasContext.clearRect(
                  0,
                  0,
                  640,
                  480
                );
                this.canvasContext.strokeRect(data.x, data.y, data.w, data.h);
                // this.getFaceBoundingBox(this.img);
              })
              .catch((error) => {
                console.log(error);
              });
        },
        true
    );
    // console.log(this.canvasForCaptureContext)
    // this.getFaceBoundingBox(this.img);
  },
  methods: {
    auth: function () {
      // const path = 'http://localhost:5000/auth'
      // axios.post(path)
      //   .then(response => {
      //     this.authResult = response.data.randomNum
      //     if(authResult){
      //       openStore()
      //       successDialog()
      //     }else{
      //       failureDialog()
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    getFaceBoundingBox: function (imgBase64) {
      const path = "http://localhost:3000/face_bb";
      const data = {
        img: imgBase64,
      };
      // console.log(imgBase64)
      axios
        .post(path, data)
        .then((response) => {
          const data = response.data;
          // console.log("####### response.data")
          // console.log(response.data)
          this.canvasContext.clearRect(
            0,
            0,
            this.video.width,
            this.video.height
          );
          this.canvasContext.strokeRect(data.x, data.y, data.w, data.h);
          // this.getFaceBoundingBox(this.img);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    captureImg: function () {
      return this.canvasForCapture.toDataURL("image/jpeg").replace(/^.*,/, "");
    },
    // openStore: function(){
    //   // const path = 'http://localhost:5000/enter'
    //   // axios.post(path)
    //   //   .then(response => {
    //   //     console.log(response.data.result)
    //   //   })
    //   //   .catch(error => {
    //   //     console.log(error)
    //   //   })
    // },
    // successDialog: function(){

    // },
    // failureDialog: function(){

    // }
  },
};
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
