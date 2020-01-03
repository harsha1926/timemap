<template>
  <v-container style="max-width: 600px;" fluid>
    <v-row>
      <v-img
        height="200px"
        src="https://media1.tenor.com/images/b30caa3463074c95d1dd35b06d3e21f5/tenor.gif?itemid=4529604"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-row align="start" justify="end" class="ma-1 pa-1">
          <div class="tenorFont white--text">Powered By Tenor</div>
        </v-row>
        <v-row align="center" justify="start" class="pa-2 ma-2 white--text">
          <div class="headline font-weight-light">My Routine</div>
        </v-row>
      </v-img>
    </v-row>
    <v-row>
      <v-tabs v-model="tab" grow>
        <v-tab :key="0">Weekday</v-tab>
        <v-tab :key="1">Weekend</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item :key="0">
          <v-timeline v-if="weekdayRoutine" dense>
            <v-timeline-item
              v-for="activity in weekdayRoutine"
              :key="activity.id"
              color="primary"
            >
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="activity.gif"></v-img>
                </v-avatar>
              </template>
              <v-row
                @click="openUpdateScheduleDialog(activity, false)"
                align="center"
              >
                <v-col cols="1" class="text-center">
                  <v-icon small class="customPointer">mdi-pencil</v-icon>
                </v-col>
                <v-col cols="4" class="caption text-center">
                  <v-flex v-if="activity.endTime">
                    <v-flex>{{ formatTime(activity.startTime) }}</v-flex>
                    <v-flex>to</v-flex>
                    <v-flex>{{ formatTime(activity.endTime) }}</v-flex>
                  </v-flex>
                  <v-flex v-else>{{ formatTime(activity.startTime) }}</v-flex>
                </v-col>
                <v-col cols="7" class="subtitle-2">{{ activity.title }}</v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-tab-item>
        <v-tab-item :key="1">
          <v-timeline v-if="weekendRoutine" dense>
            <v-timeline-item
              v-for="activity in weekendRoutine"
              :key="activity.id"
              color="primary"
            >
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="activity.gif"></v-img>
                </v-avatar>
              </template>
              <v-row
                @click="openUpdateScheduleDialog(activity, true)"
                align="center"
              >
                <v-col cols="1" class="text-center">
                  <v-icon small class="customPointer">mdi-pencil</v-icon>
                </v-col>
                <v-col cols="4" class="caption text-center">
                  <v-flex v-if="activity.endTime">
                    <v-flex>{{ formatTime(activity.startTime) }}</v-flex>
                    <v-flex>to</v-flex>
                    <v-flex>{{ formatTime(activity.endTime) }}</v-flex>
                  </v-flex>
                  <v-flex v-else>{{ formatTime(activity.startTime) }}</v-flex>
                </v-col>
                <v-col cols="7" class="subtitle-2">{{ activity.title }}</v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-tab-item>
      </v-tabs-items>
    </v-row>
    <v-dialog v-model="showEditScheduleDialog" max-width="600" eager>
      <update-schedule
        :activity="selectedActivity"
        :isWeekend="isWeekend"
        @dialog-closed="closeUpdateScheduleDialog"
        @updated-schedule="updatedSchedule"
      ></update-schedule>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import UpdateSchedule from './UpdateSchedule'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  components: {
    UpdateSchedule
  },
  data() {
    return {
      schedule: null,
      tab: null,
      showEditScheduleDialog: false,
      selectedActivity: null,
      isWeekend: false
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    weekdayRoutine() {
      if (this.schedule && this.schedule.weekday) {
        let activities = []

        for (const activity in this.schedule.weekday) {
          activities.push({
            uid: activity,
            id: this.schedule.weekday[activity].id,
            title: this.schedule.weekday[activity].title,
            startTime: this.schedule.weekday[activity].startTime,
            endTime: this.schedule.weekday[activity].endTime,
            gif: this.schedule.weekday[activity].gif
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
    },
    weekendRoutine() {
      if (this.schedule && this.schedule.weekend) {
        let activities = []

        for (const activity in this.schedule.weekend) {
          activities.push({
            id: this.schedule.weekend[activity].id,
            title: this.schedule.weekend[activity].title,
            startTime: this.schedule.weekend[activity].startTime,
            endTime: this.schedule.weekend[activity].endTime,
            gif: this.schedule.weekend[activity].gif
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
    firebaseDB.ref('schedule/' + vm.uid).once('value', function(data) {
      if (data.val()) {
        vm.schedule = data.val()
      } else {
        firebaseDB.ref('schedule/default').once('value', function(data) {
          vm.schedule = data.val()
          firebaseDB.ref('schedule/' + vm.uid).set(data.val())
        })
      }
    })
  },
  methods: {
    formatTime(time) {
      if (time) {
        return moment(time, 'HH:mm:ss').format('hh:mm a')
      } else {
        return ''
      }
    },
    openUpdateScheduleDialog(activity, isWeekend) {
      this.selectedActivity = activity
      this.isWeekend = isWeekend
      this.showEditScheduleDialog = true
    },
    closeUpdateScheduleDialog() {
      this.selectedActivity = null
      this.showEditScheduleDialog = false
    },
    updatedSchedule(activity) {
      if (activity.isWeekend) {
        this.$set(this.schedule.weekend[activity.uid], 'title', activity.title)
        this.$set(
          this.schedule.weekend[activity.uid],
          'startTime',
          activity.startTime
        )
        this.$set(
          this.schedule.weekend[activity.uid],
          'endTime',
          activity.endTime
        )
      } else {
        this.$set(this.schedule.weekday[activity.uid], 'title', activity.title)
        this.$set(
          this.schedule.weekday[activity.uid],
          'startTime',
          activity.startTime
        )
        this.$set(
          this.schedule.weekday[activity.uid],
          'endTime',
          activity.endTime
        )
      }
      this.closeUpdateScheduleDialog()
    }
  }
}
</script>
