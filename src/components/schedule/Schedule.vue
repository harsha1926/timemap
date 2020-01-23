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
        <v-tab v-for="eachDay in routine" :key="eachDay.day">
          {{ eachDay.day.substring(0, 3) }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="eachDay in routine" :key="eachDay.day">
          <v-timeline v-if="eachDay.activities" dense>
            <v-timeline-item color="grey lighten-2" small>
              <v-row align="center">
                <v-btn
                  @click="openAddActivityDialog"
                  color="primary"
                  x-small
                  fab
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              v-for="activity in eachDay.activities"
              :key="activity.id"
            >
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="activity.gif"></v-img>
                </v-avatar>
              </template>
              <v-row
                @click="openUpdateActivityDialog(activity, false)"
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
                <v-col cols="7" class="subtitle-2">{{ activity.direct }}</v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-tab-item>
      </v-tabs-items>
    </v-row>
    <v-dialog v-model="showEditActivityDialog" max-width="600" eager>
      <update-activity
        :activity="selectedActivity"
        :isWeekend="isWeekend"
        @dialog-closed="closeUpdateActivityDialog"
        @updated-activity="updatedActivity"
        @deleted-activity="deletedActivity"
        :activities="activities"
      ></update-activity>
    </v-dialog>
    <v-bottom-sheet v-model="showAddActivityDialog" eager inset>
      <v-sheet class="text-center">
        <add-activity
          ref="addActivity"
          @dialog-closed="closeAddActivityDialog"
          :activities="activities"
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
      activities: [],
      schedule: null,
      tab: null,
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
          routine.push({ day: eachDay, activities })
        }
        return this.sortByDay(routine)
      }
      return []
    }
  },
  mounted() {
    this.getSchedule()
    this.getActivities()
  },
  methods: {
    formatTime(time) {
      if (time) {
        return moment(time, 'HH:mm:ss').format('hh:mm a')
      } else {
        return ''
      }
    },
    openUpdateActivityDialog(activity, isWeekend) {
      this.selectedActivity = activity
      this.isWeekend = isWeekend
      this.showEditActivityDialog = true
    },
    closeUpdateActivityDialog() {
      this.selectedActivity = null
      this.showEditActivityDialog = false
    },
    updatedActivity() {
      this.closeUpdateActivityDialog()
    },
    deletedActivity() {
      this.closeUpdateActivityDialog()
    },
    closeAddActivityDialog() {
      this.showAddActivityDialog = false
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
      return arr.sort((a, b) => {
        const day1 = a.day.toLowerCase()
        const day2 = b.day.toLowerCase()
        return sorter[day1] - sorter[day2]
      })
    },
    openAddActivityDialog(activity) {
      this.showAddActivityDialog = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addActivity.$refs.activitySelect.focus()
        }, 10)
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
    getActivities() {
      const vm = this
      firebaseDB.ref('activities').once('value', (snapshot) => {
        snapshot.forEach((activity) => {
          vm.activities.push(activity.val())
        })
      })
    }
  }
}
</script>
