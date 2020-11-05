<template>
  <div>
    <h1>顔認証</h1>
    <div class="canvas-wrapper">
        <video id="video" width="640" height="480" autoplay></video>
        <canvas id="canvas2"></canvas>
    </div>
    <canvas id="canvas"></canvas>
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
    startAuth () {
    },
    getBoundingBox () {
    }
  },
  created () {
    this.getRandom()
  }
}
</script>

<style>
    .canvas-wrapper {
        position: relative;
    }
    .canvas-wrapper canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
    #canvas {
        display: none !important;
    }
</style>
