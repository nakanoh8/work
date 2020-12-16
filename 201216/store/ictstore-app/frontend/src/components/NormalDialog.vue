<template>
  <v-row justify="center">

    <v-dialog
      v-model="dialog"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ body }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    title: String,
    body: String
  }
}
</script>
