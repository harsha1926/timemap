<template>
  <v-form ref="form" v-model="valid">
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
                :rules="[rules.required]"
                v-model="activity"
                :items="activities"
                autocomplete="off"
                label="Select activity"
                return-object
                item-text="question"
                item-value="id"
                hide-details
                outlined
                rounded
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-right">
              <v-btn @click="cancel" text>Cancel</v-btn>
              <v-btn
                @click="
                  e1 = 2
                  startsAt = null
                  $refs.startsAt && ($refs.startsAt.selectingHour = true)
                "
                :disabled="!valid"
                color="primary"
                >Continue</v-btn
              >
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="2">
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
              <v-btn @click="cancel" text>Cancel</v-btn>
              <v-btn
                @click="
                  e1 = 3
                  endsAt = null
                  $refs.endsAt && ($refs.endsAt.selectingHour = true)
                "
                :disabled="!startsAt"
                color="primary"
                >Continue</v-btn
              >
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="3">
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
  </v-form>
</template>
<script>
export default {
  props: {
    activities: {
      type: Array,
      default() {
        return []
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
      activity: null,
      startsAt: null,
      endsAt: null,
      valid: false,
      rules: {
        required: (v) => !!v || 'Required'
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('dialog-closed')
      this.$refs.form.reset()
      this.e1 = 1
    },
    save() {
      this.$emit('activity-added', {
        activity: this.activity,
        startsAt: this.startsAt,
        endsAt: this.endsAt
      })
      this.$emit('dialog-closed')
      this.$refs.form.reset()
      this.e1 = 1
    }
  }
}
</script>
