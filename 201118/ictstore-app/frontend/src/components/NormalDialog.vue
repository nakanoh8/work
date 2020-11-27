<template>
  <v-row justify="center">

    <v-dialog
      v-model="dialog"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>
          {{ text }}
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    dialog: false,
    text: ''
  }
}
</script>
