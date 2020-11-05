<!-- HTMLを記述 -->
<template>
  <div>
    <p>Home</p>
    <button @click="getRandom">占う</button>
    <p>Random number from backend: {{ randomNum }}</p>
    <h1 v-if="randomNum%4==0">Awesome!!!</h1>
    <h2 v-if="randomNum%4==1">Good</h2>
    <h2 v-if="randomNum%4==2">Bad...</h2>
    <h1 v-if="randomNum%4==3">S〇〇ks!!!</h1>
    <video ref="video" id="video" width="640" height="480" autoplay></video>
  </div>
</template>

<!-- JavaScriptを記述 -->
<script>
import axios from 'axios'

export default {
  data () {
    return {
      randomNum: 0
    }
  },
  methods: {
    getRandom () {
      this.randomNum = this.getRandomNum()
    },
    getRandomNum () {
      const path = 'http://localhost:5000/rand'
      axios.get(path)
        .then(response => {
          this.randomNum = response.data.randomNum
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getRandom()
  },
  mounted () {
    let video = document.getElementById('video');
    // getUserMedia()でカメラ映像の取得
    let media = navigator.mediaDevices.getUserMedia({ video: true });
    //リアルタイム再生（ストリーミング）を行うためにビデオタグに流し込む
    media.then((stream) => {
        video.srcObject = stream;
    });
  }
}
</script>
<!--一行空行を入れてください-->
