<template>
  <v-stepper v-model="e1">
    <v-stepper-header v-if="selectedActivity && selectedActivity.endTime">
      <v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2"></v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row>
          <v-col cols="12">
            <span v-if="selectedActivity" class="subtitle-1"
              >{{ selectedActivity.direct }} at</span
            >
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
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn @click="deleteActivity" text>Delete</v-btn>
            <v-btn @click="cancel" text>Cancel</v-btn>
            <v-btn
              v-if="selectedActivity && selectedActivity.endTime"
              @click="
                e1 = 2
                endsAt = null
                $refs.endsAt && ($refs.endsAt.selectingHour = true)
              "
              :disabled="!startsAt"
              color="primary"
              >Continue</v-btn
            >
            <v-btn v-else @click="save" :disabled="!startsAt" color="primary"
              >Save</v-btn
            >
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
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn @click="cancel" text>Cancel</v-btn>
            <v-btn @click="save" :disabled="!endsAt" color="primary"
              >Save</v-btn
            >
          </v-col>
        </v-row>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
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
      endsAt: null
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
        startsAt: this.startsAt,
        endsAt: this.endsAt
      })
      this.$emit('dialog-closed')
      this.e1 = 1
      this.startsAt = null
    }
  }
}
</script>
