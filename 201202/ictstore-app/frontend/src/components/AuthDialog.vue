<template>
  <v-row justify="center">

    <v-dialog
      v-model="dialog"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          {{ titleText }}
        </v-card-title>
        <v-card-text>
          {{ bodyText }}
        </v-card-text>
        <v-card-text v-if="!authResult">
          ※スペースキーで閉じる
        </v-card-text>

        <!-- <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="$emit('close')"
          >
            閉じる(※スペースキー)
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    faceDetectionResult: Boolean,
    authResult: Boolean
  },
  computed: {
    titleText: function () {
      if (this.authResult) {
        return '顔認証:成功'
      } else if (!this.authResult && this.faceDetectionResult) {
        return '顔認証:失敗'
      } else if (!this.faceDetectionResult) {
        return '顔検出:失敗'
      }
    },
    bodyText: function () {
      if (this.authResult) {
        return '認証に成功しました。ストアが開錠されました。'
      } else if (!this.authResult && this.faceDetectionResult) {
        return '認証に失敗しました。もう1度撮影するか、管理者に連絡してください。'
      } else if (!this.faceDetectionResult) {
        return '顔を検出できませんでした。もう1度撮影してください。'
      }
    }
  }
}
</script>
