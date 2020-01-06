<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Name of step 3</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row>
          <v-autocomplete
            return-object
            item-text="question"
            item-value="id"
            hide-details
            :items="activities"
          ></v-autocomplete>
        </v-row>
        <v-row>
          <v-btn text>Cancel</v-btn>
          <v-btn color="primary" @click="e1 = 2">Continue</v-btn>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="e1 = 3">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="e1 = 1">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  data() {
    return {
      e1: 0,
      activities: []
    }
  },
  methods: {
    getActivities: function() {
      let vm = this
      firebaseDB.ref('activities').once('value', (snapshot) => {
        snapshot.forEach((activity) => {
          vm.activities.push(activity.val())
        })
        console.log('vm.activities', vm.activities)
      })
    }
  },
  mounted: function() {
    this.getActivities()
  }
}
</script>