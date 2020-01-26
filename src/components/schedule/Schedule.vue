<template>
  <v-container
    :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''"
    fluid
    style="max-width: 600px;"
  >
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
    <v-row v-if="schedule">
      <v-tabs v-model="tab" show-arrows>
        <v-tab v-for="eachDay in routine" :key="eachDay.index">
          {{ eachDay.day.substring(0, 3) }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="eachDay in routine" :key="eachDay.index">
          <v-timeline v-if="eachDay.activities" dense>
            <div
              v-for="(activity, index) in eachDay.activities"
              :key="activity.id"
            >
              <v-timeline-item>
                <template v-slot:icon>
                  <v-avatar>
                    <v-img :src="activity.gif"></v-img>
                  </v-avatar>
                </template>
                <v-row
                  @click="openUpdateActivityDialog(activity)"
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
                  <v-col cols="7" class="subtitle-2">
                    {{ activity.direct }}
                  </v-col>
                </v-row>
              </v-timeline-item>

              <v-timeline-item v-if="index < routine.length - 1" small>
                <template v-slot:icon>
                  <v-avatar @click="openAddActivityDialog(activity)">
                    <v-btn fab x-small>
                      <v-icon color="primary">mdi-plus</v-icon>
                    </v-btn>
                  </v-avatar>
                </template>
              </v-timeline-item>
            </div>
          </v-timeline>
        </v-tab-item>
      </v-tabs-items>
    </v-row>
    <v-bottom-sheet
      v-model="showEditActivityDialog"
      eager
      inset
      max-width="600"
    >
      <v-sheet class="text-center">
        <update-activity
          ref="updateActivity"
          :selectedActivity="selectedActivity"
          :minTime="minTime"
          :maxTime="maxTime"
          @activity-updated="updateActivity"
          @activity-deleted="deleteActivity"
          @dialog-closed="closeUpdateActivityDialog"
        ></update-activity>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="showAddActivityDialog" eager inset max-width="600">
      <v-sheet class="text-center">
        <add-activity
          ref="addActivity"
          :minTime="minTime"
          :maxTime="maxTime"
          :activities="remaningActivities"
          @activity-added="addActivity"
          @dialog-closed="closeAddActivityDialog"
        ></add-activity>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import UpdateActivity from './UpdateActivity'
import AddActivity from './AddActivity'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  components: {
    UpdateActivity,
    AddActivity
  },
  data() {
    return {
      minTime: null,
      maxTime: null,
      allActivities: [],
      schedule: null,
      tab: 0,
      showEditActivityDialog: false,
      selectedActivity: null,
      isWeekend: false,
      showAddActivityDialog: false
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    routine() {
      if (this.schedule) {
        const routine = []
        for (const eachDay in this.schedule) {
          let activities = []
          for (const activity in this.schedule[eachDay]) {
            activities.push({
              uid: activity,
              id: this.schedule[eachDay][activity].id,
              direct: this.schedule[eachDay][activity].direct,
              startTime: this.schedule[eachDay][activity].startTime,
              endTime: this.schedule[eachDay][activity].endTime,
              gif: this.schedule[eachDay][activity].gif
            })
          }

          activities = activities
            .sort((a, b) => {
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
            .map((o, index) => {
              o.index = index
              return o
            })
          routine.push({ day: eachDay, activities })
        }
        return this.sortByDay(routine)
      }
      return []
    },
    currentDay() {
      if (this.routine) {
        const found = this.routine.find((o) => o.index === this.tab)
        if (found) return found
      }
      return null
    },
    alreadyAddedActivities() {
      if (this.currentDay) {
        return this.currentDay.activities
      }
      return null
    },
    remaningActivities() {
      if (this.alreadyAddedActivities) {
        return this.allActivities.filter(
          (eachActivity) =>
            !(
              this.alreadyAddedActivities.findIndex(
                (o) => eachActivity.id === o.id
              ) > -1
            )
        )
      }
      return null
    }
  },
  mounted() {
    this.getSchedule()
    this.getAllActivities()
  },
  methods: {
    formatTime(time) {
      if (time) {
        return moment(time, 'HH:mm:ss').format('hh:mm a')
      } else {
        return ''
      }
    },
    openAddActivityDialog(startActivity) {
      this.minTime = null
      this.maxTime = null
      if (startActivity) {
        if (startActivity.endTime) {
          this.minTime = moment(startActivity.endTime, 'HH:mm:ss')
            .add(1, 'minutes')
            .format('HH:mm:ss')
        } else if (startActivity.startTime)
          this.minTime = moment(startActivity.startTime, 'HH:mm:ss')
            .add(1, 'minutes')
            .format('HH:mm:ss')
      }
      const endActivity = this.getNextActivity(startActivity)
      if (endActivity) {
        if (endActivity.startTime) {
          this.maxTime = moment(endActivity.startTime, 'HH:mm:ss')
            .add(-1, 'minutes')
            .format('HH:mm:ss')
        }
      } else {
        this.maxTime = '00:00:00'
      }

      this.showAddActivityDialog = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addActivity.$refs.activitySelect.focus()
        }, 10)
      })
    },
    closeAddActivityDialog() {
      this.showAddActivityDialog = false
    },
    addActivity(newActivity) {
      if (newActivity && this.currentDay) {
        const payload = newActivity.activity
        payload.startTime = newActivity.startsAt
        payload.endTime = newActivity.endsAt
        const vm = this
        firebaseDB
          .ref('schedule/' + this.uid + '/' + this.currentDay.day)
          .push(payload, (error) => {
            if (!error) vm.getSchedule()
            vm.minTime = null
            vm.maxTime = null
          })
      }
    },
    openUpdateActivityDialog(selectedActivity) {
      this.minTime = null
      this.maxTime = null
      this.selectedActivity = selectedActivity
      const startActivity = this.getPreviousActivity(this.selectedActivity)
      if (startActivity) {
        if (startActivity.endTime) {
          this.minTime = moment(startActivity.endTime, 'HH:mm:ss')
            .add(1, 'minutes')
            .format('HH:mm:ss')
        } else if (startActivity.startTime)
          this.minTime = moment(startActivity.startTime, 'HH:mm:ss')
            .add(1, 'minutes')
            .format('HH:mm:ss')
      }
      const endActivity = this.getNextActivity(this.selectedActivity)
      if (endActivity) {
        if (endActivity.startTime) {
          this.maxTime = moment(endActivity.startTime, 'HH:mm:ss')
            .add(-1, 'minutes')
            .format('HH:mm:ss')
        }
      }

      if (this.$refs.updateActivity.$refs.startsAt) {
        this.$refs.updateActivity.$refs.startsAt.selectingHour = true
      }
      this.showEditActivityDialog = true
    },
    closeUpdateActivityDialog() {
      this.showEditActivityDialog = false
    },
    updateActivity(updatedActivity) {
      if (updatedActivity && this.currentDay && this.selectedActivity) {
        const vm = this
        const ref = 'schedule/' + this.uid + '/' + this.currentDay.day
        firebaseDB
          .ref(ref)
          .orderByChild('id')
          .equalTo(vm.selectedActivity.id)
          .on('value', function(data) {
            data.forEach((o) => {
              if (o.key) {
                firebaseDB
                  .ref(ref + '/' + o.key)
                  .update({
                    startTime: updatedActivity.startsAt,
                    endTime: updatedActivity.endsAt
                  })
                  .then(() => {
                    vm.selectedActivity = null
                    vm.minTime = null
                    vm.maxTime = null
                    vm.getSchedule()
                  })
              }
            })
          })
      }
    },
    deleteActivity() {
      if (this.currentDay && this.selectedActivity) {
        const vm = this
        const ref = 'schedule/' + this.uid + '/' + this.currentDay.day
        firebaseDB
          .ref(ref)
          .orderByChild('id')
          .equalTo(vm.selectedActivity.id)
          .on('value', function(data) {
            data.forEach((o) => {
              if (o.key) {
                firebaseDB
                  .ref(ref + '/' + o.key)
                  .set(null)
                  .then(() => {
                    vm.selectedActivity = null
                    vm.minTime = null
                    vm.maxTime = null
                    vm.getSchedule()
                  })
              }
            })
          })
      }
    },
    getPreviousActivity(activity) {
      if (this.routine) {
        const index = this.alreadyAddedActivities.findIndex(
          (o) => o.index === activity.index
        )
        if (index > -1) {
          return this.alreadyAddedActivities.find((o) => o.index === index - 1)
        }
      }
    },
    getNextActivity(activity) {
      if (this.routine) {
        const index = this.alreadyAddedActivities.findIndex(
          (o) => o.index === activity.index
        )
        if (index > -1) {
          return this.alreadyAddedActivities.find((o) => o.index === index + 1)
        }
      }
    },
    sortByDay(arr) {
      const sorter = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7
      }
      return arr
        .sort((a, b) => {
          const day1 = a.day.toLowerCase()
          const day2 = b.day.toLowerCase()
          return sorter[day1] - sorter[day2]
        })
        .map((o, index) => {
          o.index = index
          return o
        })
    },
    getSchedule() {
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
    getAllActivities() {
      const vm = this
      firebaseDB.ref('activities').once('value', (snapshot) => {
        snapshot.forEach((activity) => {
          vm.allActivities.push(activity.val())
        })
      })
    }
  }
}
</script>
