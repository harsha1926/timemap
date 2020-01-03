<template>
  <v-container fluid class="ma-0 pa-0">
    <v-card :disabled="loading">
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-text-field
              v-model="title"
              :rules="[rules.required]"
              hide-details
              label="Title"
              outlined
            ></v-text-field>
          </v-row>

          <v-row
            v-if="activity && activity.endTime"
            align="center"
            justify="center"
          >
            <v-tabs v-model="tab" grow>
              <v-tab :key="0">Start's at</v-tab>
              <v-tab :key="1">End's at</v-tab>
              <v-tab-item :key="0">
                <v-row align="center" justify="center" class="ma-2">
                  <v-time-picker
                    v-model="startTime"
                    ampm-in-title
                  ></v-time-picker>
                </v-row>
              </v-tab-item>
              <v-tab-item :key="1">
                <v-row align="center" justify="center" class="ma-2">
                  <v-time-picker
                    v-model="endTime"
                    ampm-in-title
                  ></v-time-picker>
                </v-row>
              </v-tab-item>
            </v-tabs>
          </v-row>
          <v-row v-else align="center" justify="center" class="ma-2">
            <v-time-picker v-model="startTime" ampm-in-title></v-time-picker>
          </v-row>

          <v-row justify="end">
            <v-btn @click="$emit('dialog-closed')" text class="mr-3"
              >Close</v-btn
            >
            <v-btn @click="updatedSchedule" text class="mr-3">Save</v-btn>
          </v-row>
        </v-form>
        <v-row
          v-if="error"
          align="center"
          justify="center"
          class="overline error--text ma-2 pa-2"
          >{{ errorMsg }}</v-row
        >
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  props: {
    activity: {
      type: Object,
      default() {
        return null
      }
    },
    isWeekend: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      tab: null,
      error: false,
      errorMsg: null,
      loading: false,
      valid: null,
      rules: {
        required: (value) => !!value || 'Required.'
      },
      title: null,
      startTime: null,
      endTime: null
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    width() {
      if (window.innerWidth < 450) return window.innerWidth
      else return 450
    }
  },
  watch: {
    activity: {
      handler(newVal) {
        if (newVal) {
          this.title = newVal.title
          this.startTime = moment(newVal.startTime, 'HH:mm:ss').format('HH:mm')
          if (newVal.endTime) {
            this.endTime = moment(newVal.endTime, 'HH:mm:ss').format('HH:mm')
          }
        } else {
          this.title = null
          this.startTime = null
          this.endTime = null
        }
      },
      deep: true
    }
  },
  methods: {
    updatedSchedule() {
      const vm = this
      const updatedSchedule = {
        uid: vm.activity.uid,
        id: vm.activity.id,
        title: vm.title,
        startTime: vm.startTime + ':00',
        endTime: vm.activity.endTime ? vm.endTime + ':00' : null,
        gif: vm.activity.gif,
        isWeekend: vm.isWeekend
      }
      if (vm.isWeekend) {
        firebaseDB
          .ref('schedule/' + vm.uid + '/weekend/' + vm.activity.uid)
          .update(updatedSchedule)
      } else {
        firebaseDB
          .ref('schedule/' + vm.uid + '/weekday/' + vm.activity.uid)
          .update(updatedSchedule)
      }
      vm.$emit('updated-schedule', updatedSchedule)
    }
  }
}
</script>
