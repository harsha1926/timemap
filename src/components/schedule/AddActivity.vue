<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 2" step="2"></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3"></v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              ref="activitySelect"
              v-model="activity"
              :items="activities"
              label="Select activity"
              return-object
              item-text="question"
              item-value="id"
              hide-details
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn @click="cancel" text>Cancel</v-btn>
            <v-btn @click="e1 = 2" color="primary">Continue</v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-row>
          <v-col cols="12">
            <v-time-picker
              v-model="startsAt"
              :full-width="$vuetify.breakpoint.xsOnly"
              ampm-in-title
            ></v-time-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn @click="cancel" text>Cancel</v-btn>
            <v-btn @click="e1 = 3" color="primary">Continue</v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-row>
          <v-col cols="12">
            <v-time-picker
              v-model="endsAt"
              :full-width="$vuetify.breakpoint.xsOnly"
              ampm-in-title
            ></v-time-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn @click="cancel" text>Cancel</v-btn>
            <v-btn @click="save" color="primary">Save</v-btn>
          </v-col>
        </v-row>
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
      e1: 0,
      activity: null,
      startsAt: null,
      endsAt: null
    }
  },
  methods: {
    cancel() {
      this.$emit('dialog-closed')
      this.e1 = 1
      this.activity = null
      this.startsAt = null
      this.endsAt = null
    },
    save() {
      this.$emit('dialog-closed')
      this.e1 = 1
      this.activity = null
      this.startsAt = null
      this.endsAt = null
    }
  }
}
</script>
