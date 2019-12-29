<template>
  <v-card class="mx-auto">
    <v-card flat>
      <v-img
        height="200px"
        src="https://media1.tenor.com/images/b30caa3463074c95d1dd35b06d3e21f5/tenor.gif?itemid=4529604"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-row align="start" justify="start" class="pa-2 ma-2 white--text">
          <div class="headline font-weight-light">My Routine</div>
        </v-row>
      </v-img>
    </v-card>
    <v-card-text class="py-0">
      <v-tabs v-model="tab" grow>
        <v-tab :key="0">Weekday</v-tab>
        <v-tab :key="1">Weekend</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item :key="0">
          <v-timeline v-if="schedule && schedule.weekday" align-top dense>
            <v-timeline-item
              v-for="activity in weekdayRoutine"
              :key="activity.id"
              color="primary"
            >
              <template v-slot:icon>
                <v-avatar color="grey darken-3">
                  <v-img :src="activity.gif" class="elevation-6"></v-img>
                </v-avatar>
              </template>
              <v-row justify="space-between">
                <v-col cols="4">
                  <strong>{{ formatTime(activity.startTime) }}</strong>
                </v-col>
                <v-col>
                  <strong>{{ activity.title }}</strong>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  data() {
    return {
      schedule: null,
      tab: null
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    weekdayRoutine() {
      if (this.schedule && this.schedule.weekday) {
        let activities = []
        for (const activity in this.schedule.weekday) {
          activities.push({
            id: activity,
            title: this.schedule.weekday[activity].title,
            startTime: this.schedule.weekday[activity].startTime,
            duration: this.schedule.weekday[activity].duration,
            gif: this.schedule.weekday[activity].startGIF
          })
        }
        activities = activities.sort((a, b) => {
          const aStartTime = moment(a.startTime, 'HH:mm:ss')
          const bStartTime = moment(b.startTime, 'HH:mm:ss')
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
  mounted() {
    const vm = this
    firebaseDB.ref('schedule1/' + vm.uid).once('value', function(data) {
      if (data.val()) vm.schedule = data.val()
      else
        firebaseDB.ref('schedule1/default').once('value', function(data) {
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
