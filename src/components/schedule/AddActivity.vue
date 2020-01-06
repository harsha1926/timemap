<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Select activity</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Start's at</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">End's at</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card>
          <v-card-text>
            <v-autocomplete
              :items="activities"
              return-object
              item-text="question"
              item-value="id"
              hide-details
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="$emit('dialog-closed')">Cancel</v-btn>
            <v-btn @click="e1 = 2" color="primary">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn @click="e1 = 3" color="primary">Continue</v-btn>

        <v-btn text @click="$emit('dialog-closed')">Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn @click="e1 = 1" color="primary">Continue</v-btn>

        <v-btn text @click="$emit('dialog-closed')">Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  props: {
    activities: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      e1: 0
    }
  }
}
</script>
