<template>
  <div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2"></v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-row>
            <v-col cols="12">
              <span v-if="selectedActivity" class="subtitle-1">{{ selectedActivity.question }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-time-picker
                ref="startsAt"
                v-model="startsAt"
                :min="minTime"
                :max="maxTime"
                :full-width="$vuetify.breakpoint.xsOnly"
                format="24hr"
              ></v-time-picker>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="2">
              <v-btn @click="showWarning = true" small icon fab color="error">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10" class="text-right">
              <v-btn @click="cancel" text>Cancel</v-btn>
              <v-btn @click="nextStep" :disabled="!startsAt" color="primary">Continue</v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-row>
            <v-col cols="12">
              <span v-if="selectedActivity" class="subtitle-1">Ends at</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-time-picker
                ref="endsAt"
                v-model="endsAt"
                :min="startsAt"
                :max="maxTime"
                :full-width="$vuetify.breakpoint.xsOnly"
                format="24hr"
              ></v-time-picker>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="4">
              <v-switch v-model="applyToAllDays" label="All days"></v-switch>
            </v-col>
            <v-col cols="8" class="text-right">
              <v-btn @click="cancel" text>Cancel</v-btn>
              <v-btn @click="save" :disabled="!endsAt" color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-dialog v-model="showWarning" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-actions>
          <v-btn @click="deleteActivity">Yes</v-btn>
          <v-btn @click="showWarning = false" color="primary">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    selectedActivity: {
      type: Object,
      default() {
        return null
      }
    },
    minTime: {
      type: String,
      default() {
        return null
      }
    },
    maxTime: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      e1: 1,
      startsAt: null,
      endsAt: null,
      applyToAllDays: true,
      showWarning: false
    }
  },
  watch: {
    selectedActivity(newVal) {
      if (newVal) {
        this.startsAt = newVal.startTime
      } else {
        this.startsAt = null
        this.endsAt = null
      }
    }
  },
  methods: {
    deleteActivity() {
      this.$emit('activity-deleted')
      this.$emit('dialog-closed')
      this.e1 = 1
      this.startsAt = null
    },
    cancel() {
      this.$emit('dialog-closed')
      this.e1 = 1
      this.startsAt = null
    },
    save() {
      this.$emit('activity-updated', {
        startTime: this.startsAt,
        endTime: this.endsAt,
        applyToAllDays: this.applyToAllDays
      })
      this.$emit('dialog-closed')
      this.e1 = 1
      this.startsAt = null
    },
    nextStep() {
      this.e1 = 2
      this.endsAt = null
      if (this.$refs.endsAt) this.$refs.endsAt.selectingHour = true
    }
  }
}
</script>
