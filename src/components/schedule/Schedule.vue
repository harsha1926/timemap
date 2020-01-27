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
    <v-row v-if="reArragedSchedule">
      <v-tabs v-model="tab" show-arrows>
        <v-tab v-for="eachDay in reArragedSchedule" :key="eachDay.index">{{
          eachDay.day.substring(0, 3)
        }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="eachDay in reArragedSchedule" :key="eachDay.index">
          <v-timeline v-if="eachDay.activities" dense>
            <v-timeline-item>
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="''"></v-img>
                </v-avatar>
              </template>
              <v-row @click="openUpdateDayStartEndDialog(true)" align="center">
                <v-col cols="1" class="text-center">
                  <v-icon small class="customPointer">mdi-pencil</v-icon>
                </v-col>
                <v-col cols="4" class="caption text-center">
                  <v-flex v-if="dayStartTime">
                    <v-flex>{{ formatTime(dayStartTime) }}</v-flex>
                  </v-flex>
                </v-col>
                <v-col cols="7" class="subtitle-2">Good Morning!</v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item small>
              <template v-slot:icon>
                <v-avatar @click="openAddActivityDialog()">
                  <v-btn fab x-small>
                    <v-icon color="primary">mdi-plus</v-icon>
                  </v-btn>
                </v-avatar>
              </template>
            </v-timeline-item>

            <div v-for="activity in eachDay.activities" :key="activity.index">
              <v-timeline-item>
                <template v-slot:icon>
                  <v-avatar>
                    <v-img :src="''"></v-img>
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
                    <v-flex v-if="activity.startTime && activity.endTime">
                      <v-flex>{{ formatTime(activity.startTime) }}</v-flex>
                      <v-flex>to</v-flex>
                      <v-flex>{{ formatTime(activity.endTime) }}</v-flex>
                    </v-flex>
                  </v-col>
                  <v-col
                    v-if="activity.activityObj"
                    cols="7"
                    class="subtitle-2"
                    >{{ activity.activityObj.direct }}</v-col
                  >
                </v-row>
              </v-timeline-item>

              <v-timeline-item small>
                <template v-slot:icon>
                  <v-avatar @click="openAddActivityDialog(activity)">
                    <v-btn fab x-small>
                      <v-icon color="primary">mdi-plus</v-icon>
                    </v-btn>
                  </v-avatar>
                </template>
              </v-timeline-item>
            </div>
            <v-timeline-item>
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="''"></v-img>
                </v-avatar>
              </template>
              <v-row @click="openUpdateDayStartEndDialog(false)" align="center">
                <v-col cols="1" class="text-center">
                  <v-icon small class="customPointer">mdi-pencil</v-icon>
                </v-col>
                <v-col cols="4" class="caption text-center">
                  <v-flex v-if="dayEndTime">
                    <v-flex>{{ formatTime(dayEndTime) }}</v-flex>
                  </v-flex>
                </v-col>
                <v-col cols="7" class="subtitle-2">Good Night!</v-col>
              </v-row>
            </v-timeline-item>
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
          :activities="allActivities"
          @activity-added="addActivity"
          @dialog-closed="closeAddActivityDialog"
        ></add-activity>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet
      v-model="showUpdateDayStartEndDialog"
      eager
      inset
      max-width="600"
    >
      <v-sheet class="text-center">
        <update-day-start-end
          ref="updateActivity"
          :selectedTime="selectedTime"
          :isStart="isStart"
          :minTime="minTime"
          :maxTime="maxTime"
          @activity-updated="updateDayStartEnd"
          @dialog-closed="closeUpdateDayStartEndDialog"
        ></update-day-start-end>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import UpdateActivity from './UpdateActivity'
import AddActivity from './AddActivity'
import UpdateDayStartEnd from './UpdateDayStartEnd'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  components: {
    UpdateActivity,
    AddActivity,
    UpdateDayStartEnd
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
      showAddActivityDialog: false,
      showUpdateDayStartEndDialog: false,
      selectedTime: null,
      isStart: true,
      reArragedSchedule: [],
      sorter: {
        monday: 0,
        tuesday: 1,
        wednesday: 2,
        thursday: 3,
        friday: 4,
        saturday: 5,
        sunday: 6
      }
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    activeTab() {
      for (const key in this.sorter) {
        if (this.sorter[key] === this.tab) return key
      }
      return null
    },
    currentDay() {
      if (this.schedule) {
        const found = this.schedule.find((o) => o.day === this.activeTab)
        if (found) return found
      }
      return null
    },
    dayStartTime() {
      if (this.currentDay) {
        return this.currentDay.dayStartTime
      }
      return null
    },
    dayEndTime() {
      if (this.currentDay) {
        return this.currentDay.dayEndTime
      }
      return null
    },
    currentDayActivities() {
      if (this.reArragedSchedule) {
        const found = this.reArragedSchedule.find((o) => o.index === this.tab)
        if (found) {
          return found.activities
        }
      }
      return null
    }
  },
  mounted() {
    this.getSchedule()
  },
  methods: {
    openUpdateDayStartEndDialog(isStart) {
      this.minTime = null
      this.maxTime = null
      this.isStart = isStart
      if (isStart) {
        const firstActivity = this.getFirstActivity()
        if (firstActivity) {
          this.maxTime = moment(firstActivity.startTime, 'HH:mm')
            .add(-1, 'minutes')
            .format('HH:mm')
        }
        this.selectedTime = this.dayStartTime
      } else {
        const lastActivity = this.getLastActivity()
        if (lastActivity) {
          this.minTime = moment(lastActivity.endTime, 'HH:mm')
            .add(+1, 'minutes')
            .format('HH:mm')
        }
        this.selectedTime = this.dayEndTime
      }

      this.showUpdateDayStartEndDialog = true
    },
    closeUpdateDayStartEndDialog() {
      this.showUpdateDayStartEndDialog = false
    },
    updateDayStartEnd(payload) {
      if (payload.applyToAllDays) {
        this.schedule.map((eachday) => {
          if (this.isStart) {
            eachday.dayStartTime = payload.time
          } else {
            eachday.dayEndTime = payload.time
          }
        })
        const vm = this
        firebaseDB
          .ref('schedule/' + this.uid)
          .set(this.schedule)
          .then(() => {
            vm.getSchedule()
          })
      } else {
        const found = this.schedule.find((o) => o.day === this.activeTab)
        if (found) {
          if (this.isStart) {
            found.dayStartTime = payload.time
          } else {
            found.dayEndTime = payload.time
          }
          const vm = this
          firebaseDB
            .ref('schedule/' + this.uid)
            .set(this.schedule)
            .then(() => {
              vm.getSchedule()
            })
        }
      }
    },
    formatTime(time) {
      if (time) {
        return moment(time, 'HH:mm').format('hh:mm a')
      } else {
        return ''
      }
    },
    getFirstActivity() {
      if (this.currentDayActivities) {
        return this.currentDayActivities.find((o) => o.index === 0)
      }
    },
    getLastActivity() {
      if (this.currentDayActivities) {
        return this.currentDayActivities.find(
          (o) => o.index === this.currentDayActivities.length - 1
        )
      }
    },
    getPreviousActivity(activity) {
      if (this.currentDayActivities) {
        if (activity.index === 0) {
          return {
            id: 'awake',
            endTime: this.dayStartTime
          }
        }
        const index = this.currentDayActivities.findIndex(
          (o) => o.index === activity.index
        )
        if (index > -1) {
          return this.currentDayActivities.find((o) => o.index === index - 1)
        }
      }
    },
    getNextActivity(activity) {
      if (this.currentDayActivities) {
        if (activity.index === this.currentDayActivities.length - 1) {
          return {
            id: 'sleep',
            startTime: this.dayEndTime
          }
        }
        const index = this.currentDayActivities.findIndex(
          (o) => o.index === activity.index
        )
        if (index > -1) {
          return this.currentDayActivities.find((o) => o.index === index + 1)
        }
      }
    },
    openAddActivityDialog(startActivity) {
      this.minTime = null
      this.maxTime = null
      if (startActivity) {
        if (startActivity.endTime) {
          this.minTime = moment(startActivity.endTime, 'HH:mm')
            .add(1, 'minutes')
            .format('HH:mm')
        } else if (startActivity.startTime)
          this.minTime = moment(startActivity.startTime, 'HH:mm')
            .add(1, 'minutes')
            .format('HH:mm')
        const endActivity = this.getNextActivity(startActivity)
        if (endActivity) {
          if (endActivity.startTime) {
            this.maxTime = moment(endActivity.startTime, 'HH:mm')
              .add(-1, 'minutes')
              .format('HH:mm')
          }
        }
      } else {
        this.minTime = moment(this.dayStartTime, 'HH:mm')
          .add(+1, 'minutes')
          .format('HH:mm')
        const endActivity = this.getFirstActivity()
        if (endActivity) {
          if (endActivity.startTime) {
            this.maxTime = moment(endActivity.startTime, 'HH:mm')
              .add(-1, 'minutes')
              .format('HH:mm')
          }
        }
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
      if (newActivity && this.schedule) {
        const vm = this
        const payload = {
          id: newActivity.id,
          startTime: newActivity.startTime,
          endTime: newActivity.endTime
        }
        if (newActivity.applyToAllDays) {
          this.schedule.map((eachday) => {
            eachday.activities.push(payload)
          })
          firebaseDB
            .ref('schedule/' + this.uid)
            .set(this.schedule)
            .then(() => {
              vm.getSchedule()
            })
        } else {
          const found = this.schedule.find((o) => o.day === this.activeTab)
          if (found) {
            found.activities.push(payload)
            const vm = this
            firebaseDB
              .ref('schedule/' + this.uid)
              .set(this.schedule)
              .then(() => {
                vm.getSchedule()
              })
          }
        }
      }
    },
    openUpdateActivityDialog(selectedActivity) {
      this.minTime = null
      this.maxTime = null
      this.selectedActivity = selectedActivity
      const startActivity = this.getPreviousActivity(this.selectedActivity)
      if (startActivity) {
        if (startActivity.endTime) {
          this.minTime = moment(startActivity.endTime, 'HH:mm')
            .add(1, 'minutes')
            .format('HH:mm')
        } else if (startActivity.startTime)
          this.minTime = moment(startActivity.startTime, 'HH:mm')
            .add(1, 'minutes')
            .format('HH:mm')
      }
      const endActivity = this.getNextActivity(this.selectedActivity)
      if (endActivity) {
        if (endActivity.startTime) {
          this.maxTime = moment(endActivity.startTime, 'HH:mm')
            .add(-1, 'minutes')
            .format('HH:mm')
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
      if (updatedActivity && this.selectedActivity) {
        if (updatedActivity.applyToAllDays) {
          this.schedule.map((eachday) => {
            const activity = eachday.activities.find(
              (o) => o.id === this.selectedActivity.id
            )
            if (activity) {
              if (updatedActivity.startTime) {
                activity.startTime = updatedActivity.startTime
              }

              if (updatedActivity.endTime) {
                activity.endTime = updatedActivity.endTime
              }
            }
          })

          const vm = this
          firebaseDB
            .ref('schedule/' + this.uid)
            .set(this.schedule)
            .then(() => {
              vm.getSchedule()
            })
        } else {
          const found = this.schedule.find((o) => o.day === this.activeTab)
          if (found) {
            const activity = found.activities.find(
              (o) => o.id === this.selectedActivity.id
            )
            if (activity) {
              if (updatedActivity.startTime) {
                activity.startTime = updatedActivity.startTime
              }

              if (updatedActivity.endTime) {
                activity.endTime = updatedActivity.endTime
              }
            }

            const vm = this
            firebaseDB
              .ref('schedule/' + this.uid)
              .set(this.schedule)
              .then(() => {
                vm.getSchedule()
              })
          }
        }
      }
    },
    deleteActivity() {
      if (this.currentDay && this.selectedActivity) {
        const found = this.schedule.find((o) => o.day === this.activeTab)
        if (found) {
          const index = found.activities.findIndex(
            (o) => o.id === this.selectedActivity.id
          )
          if (index > -1) {
            found.activities.splice(index, 1)
          }

          const vm = this
          firebaseDB
            .ref('schedule/' + this.uid)
            .set(this.schedule)
            .then(() => {
              vm.getSchedule()
            })
        }
      }
    },
    sortByDay(arr) {
      return arr
        .sort((a, b) => {
          const day1 = a.day.toLowerCase()
          const day2 = b.day.toLowerCase()
          return this.sorter[day1] - this.sorter[day2]
        })
        .map((o, index) => {
          o.index = index
          return o
        })
    },
    reArrangeScheduleActivities(data) {
      let schedule = []
      data.forEach((eachDay) => {
        if (eachDay.val()) {
          const eachDaySchedule = { day: eachDay.val().day }
          eachDaySchedule.dayStartTime = eachDay.val().dayStartTime
          eachDaySchedule.dayEndTime = eachDay.val().dayEndTime
          eachDaySchedule.activities = []
          eachDay.val().activities.map((activity) => {
            const actObj = this.allActivities.find((o) => o.id === activity.id)
            if (actObj) {
              activity.activityObj = actObj
              eachDaySchedule.activities.push(activity)
            }
          })

          eachDaySchedule.activities = eachDaySchedule.activities
            .sort((a, b) => {
              const aTime = moment(a.startTime, 'HH:mm')
              const bTime = moment(b.startTime, 'HH:mm')
              if (aTime.isAfter(bTime)) {
                return 1
              } else if (aTime.isBefore(bTime)) {
                return -1
              } else {
                return 0
              }
            })
            .map((o, index) => {
              o.index = index
              return o
            })
          schedule.push(eachDaySchedule)
        }
      })

      schedule = this.sortByDay(schedule)
      this.reArragedSchedule = schedule
    },
    getSchedule() {
      const vm = this
      if (this.allActivities.length > 0) {
        firebaseDB.ref('schedule/' + vm.uid).once('value', function(data) {
          if (data.val()) {
            vm.reArrangeScheduleActivities(data)
            vm.schedule = data.val()
          }
        })
      } else {
        firebaseDB.ref('activities').once('value', (snapshot) => {
          snapshot.forEach((activity) => {
            vm.allActivities.push(activity.val())
          })
          firebaseDB.ref('schedule/' + vm.uid).once('value', function(data) {
            if (data.val()) {
              vm.reArrangeScheduleActivities(data)
              vm.schedule = data.val()
            } else {
              firebaseDB.ref('schedule/default').once('value', function(data) {
                firebaseDB.ref('schedule/' + vm.uid).set(data.val())
                vm.reArrangeScheduleActivities(data)
                vm.schedule = data.val()
              })
            }
          })
        })
      }
    }
  }
}
</script>
