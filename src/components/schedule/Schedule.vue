<template>
  <v-container fluid>
    <v-tabs v-model="tab" grow>
      <v-tab :key="0">Weekday</v-tab>
      <v-tab :key="1">Weekend</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item :key="0">
        <v-timeline align-top dense v-if="schedule && schedule.weekday">
          <v-timeline-item color="primary" small>
            <v-row class="pt-1" justify="space-between">
              <v-col cols="4">
                <strong>{{ formatTime(weekdayStartTime) }}</strong>
              </v-col>
              <v-col>
                <strong>Good Morning!</strong>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item
            color="primary"
            small
            v-for="activity in weekdayRoutine"
            :key="activity.id"
          >
            <v-row class="pt-1" justify="space-between">
              <v-col cols="4">
                <strong>{{ formatTime(activity.startTime) }}</strong>
              </v-col>
              <v-col>
                <strong>{{ activity.id }}</strong>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item color="primary" small>
            <v-row class="pt-1" justify="space-between">
              <v-col cols="4">
                <strong>{{ formatTime(weekdayEndTime) }}</strong>
              </v-col>
              <v-col>
                <strong>Good Night!</strong>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
import { firebaseDB } from '@/services/firebaseInit.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      schedule: null,
      tab: null
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    weekdayStartTime: function() {
      if (this.schedule && this.schedule.weekday)
        return this.schedule.weekday.dayStartTime
      else return null
    },
    weekdayEndTime: function() {
      if (this.schedule && this.schedule.weekday)
        return this.schedule.weekday.dayEndTime
      else return null
    },
    weekdayRoutine: function() {
      if (this.schedule && this.schedule.weekday) {
        let activities = []
        for (let activity in this.schedule.weekday.routine) {
          activities.push({
            id: activity,
            title: this.schedule.weekday.routine[activity].title,
            startTime: this.schedule.weekday.routine[activity].startTime,
            duration: this.schedule.weekday.routine[activity].duration
          })
        }
        activities = activities.sort((a, b) => {
          let aStartTime = moment(a.startTime, 'HH:mm:ss')
          let bStartTime = moment(b.startTime, 'HH:mm:ss')
          if (aStartTime.isAfter(bStartTime)) {
            return 1
          } else if (aStartTime.isBefore(bStartTime)) {
            return -1
          } else {
            return 0
          }
        })
        return activities
      } else return []
    }
  },
  mounted: function() {
    let vm = this
    firebaseDB.ref('schedule/' + vm.uid).once('value', function(data) {
      if (data.val()) vm.schedule = data.val()
      else
        firebaseDB.ref('schedule/default').once('value', function(data) {
          vm.schedule = data.val()
        })
    })
  },
  methods: {
    formatTime(time) {
      if (time) {
        return moment(time, 'HH:mm:ss').format('hh:mm a')
      } else {
        return ''
      }
    }
  }
}
</script>
