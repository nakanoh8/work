<!-- HTMLを記述 -->
<template>
  <div>
    <h1>Home</h1>
    <button v-on:click="moveHelloWorld">ボタン</button>
  </div>
</template>

<!-- JavaScriptを記述 -->
<script>
import axios from "axios";

export default {
  mounted() {
    document.addEventListener(
      "keydown",
      this.addKeyEvent
      );
  },
  methods: {
    moveHelloWorld: function() {
      this.$router.push({ name: "HelloWorld" }).catch(err => {});
    },
    addKeyEvent(event){
      const keyName = event.key;
      if (keyName === " ") {
        console.log("Keydown in Home")
        document.removeEventListener(
          "keydown",
          this.addKeyEvent
          );
        this.moveHelloWorld();
      }
    }
  }
};
</script>
<!--一行空行を入れてください-->
