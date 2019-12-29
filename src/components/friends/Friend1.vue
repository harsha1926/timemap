<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" type="card-avatar"></v-skeleton-loader>
    <v-row v-else-if="friend">
      <v-row>
        <v-card flat>
          <v-card-title>
            <v-avatar size="35">
              <v-img :src="friend.photoURL"></v-img>
            </v-avatar>
            {{ displayNameCaptilize }} {{ activityHeading }}
          </v-card-title>
          <v-card-subtitle>
            {{ localTimeFormattedString }}
            <!-- <p class="ma-0 pa-0">Updated at {{ lastUpdatedString }}</p> -->
          </v-card-subtitle>
        </v-card>
      </v-row>

      <v-row>
        <v-card flat>
          <v-img
            :src="activityPhoto"
            height="200px"
            width="350px"
            gradient="to top left, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
            <v-card-title></v-card-title>
            <v-card-subtitle>{{ activityQuote }}</v-card-subtitle>
          </v-img>
        </v-card>
      </v-row>
      <v-row>
        <v-card flat>
          <v-icon
            @click="sendWhatsAppMessage(friend.phoneNumber)"
            :disabled="!friend.phoneNumber"
            class="customPointer"
            color="primary"
            >mdi-whatsapp</v-icon
          >
          <v-icon
            @click="callPhone(friend.phoneNumber)"
            :disabled="!friend.phoneNumber"
            class="customPointer"
            color="primary"
            >mdi-phone</v-icon
          >
          <v-icon
            @click="sendTextMessage(friend.phoneNumber)"
            :disabled="!friend.phoneNumber"
            class="customPointer"
            color="primary"
            >mdi-message-outline</v-icon
          >
          <v-icon
            @click="sendEmailMessage(friend.email)"
            class="customPointer"
            color="primary"
            >mdi-email-outline</v-icon
          >
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" class="customPointer" color="primary"
                >mdi-dots-vertical</v-icon
              >
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <v-icon
                    @click="removeFriendWarning"
                    class="customPointer"
                    color="error"
                    >mdi-delete</v-icon
                  >
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </v-row>
    </v-row>
    <v-dialog v-model="showRemoveFriendWarning" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-actions>
          <v-btn @click="removeFriend">Yes</v-btn>
          <v-btn @click="showRemoveFriendWarning = false" color="primary"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import { fetchTimezone } from '@/api/timezone'
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  props: {
    friendId: {
      type: String,
      default() {
        return null
      }
    },
    category: {
      type: String,
      default() {
        return 'funny'
      }
    }
  },
  data() {
    return {
      timezone: null,
      loading: false,
      friend: null,
      schedule: null,
      now: new Date(),
      activityPhoto: '',
      activityQuote: '',
      lastUpdated: null,
      showRemoveFriendWarning: false
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    localTimeFormattedString() {
      if (this.timezone) {
        return momentTimezone(this.now)
          .tz(this.timezone)
          .format('ddd MMM DD, hh:mm A')
      } else {
        return '...'
      }
    },
    lastUpdatedString() {
      if (this.lastUpdated) {
        return momentTimezone(this.lastUpdated).format('ddd MMM DD, hh:mm A')
      } else {
        return '...'
      }
    },
    displayNameCaptilize() {
      if (!this.friend || (this.friend && !this.friend.displayName)) return ''
      return this.friend.displayName
        .split(' ')
        .map((o) => this.capitalizeFirstLetter(o))
        .join(' ')
    },
    localTime() {
      if (this.timezone) {
        return momentTimezone(this.now).tz(this.timezone)
      } else {
        return null
      }
    },
    activity() {
      if (!this.schedule) return null
      else {
        let activity = null
        if (this.localTime) {
          if (this.isDayActive()) {
            activity = this.getActiveActivity()
            if (!activity) {
              activity = 'free'
            }
          } else {
            activity = 'sleep'
          }
        }
        return activity
      }
    },
    activityHeading() {
      if (this.activity) {
        if (this.activity === 'sleep') return ' is sleeping..'
        else if (this.activity === 'breakfast') return ' is having breakfast..'
        else if (this.activity === 'work') return ' is at work now..'
        else if (this.activity === 'lunch') return ' is having lunch..'
        else if (this.activity === 'dinner') return ' is having dinner..'
        else if (this.activity === 'free') return ' is free now..'
        else return ''
      } else {
        return '...'
      }
    }
  },
  watch: {
    activity: {
      handler(newVal) {
        if (newVal) {
          let backupURL = null
          let backupQuote = null
          const vm = this
          firebaseDB
            .ref('gifs')
            .orderByChild('activity')
            .equalTo(newVal)
            .once('value', function(snapshot) {
              snapshot.forEach((data) => {
                backupURL = data.val().url
                if (data.val() && data.val().category === vm.category) {
                  vm.activityPhoto = data.val().url
                }
              })
              if (!vm.activityPhoto) {
                vm.activityPhoto = backupURL
              }
            })

          firebaseDB
            .ref('quotes')
            .orderByChild('activity')
            .equalTo(newVal)
            .once('value', function(snapshot) {
              snapshot.forEach((data) => {
                backupQuote = data.val().quote
                if (data.val() && data.val().category === vm.category) {
                  vm.activityQuote = data.val().quote
                }
              })
              if (!vm.activityPhoto) {
                vm.activityQuote = backupQuote
              }
            })
        }
      }
    }
  },
  created() {
    const vm = this
    setInterval(function() {
      vm.now = new Date()
    }, 60000)
  },
  mounted() {
    if (this.friendId) {
      const vm = this
      vm.loading = true
      firebaseDB
        .ref('users/' + vm.friendId)
        .once('value', function(data) {
          vm.friend = data.val()
          if (vm.friend && vm.friend.currentLocation) {
            vm.lastUpdated = vm.friend.currentLocation.lastUpdated
            fetchTimezone(
              vm.friend.currentLocation.latitude,
              vm.friend.currentLocation.longitude,
              Date.now() / 1000
            ).then((res) => {
              vm.timezone = res.data.timeZoneId
            })
          } else {
            firebaseDB
              .ref('gifs')
              .orderByChild('category')
              .limitToLast(1)
              .equalTo('sad')
              .once('value', function(snapshot) {
                snapshot.forEach((data) => {
                  if (data.val()) vm.activityPhoto = data.val().url
                })
              })
          }
        })
        .finally(() => {
          vm.loading = false
        })

      firebaseDB.ref('schedule/' + vm.friendId).once('value', function(data) {
        if (data.val()) vm.schedule = data.val()
        else
          firebaseDB.ref('schedule/default').once('value', function(data) {
            vm.schedule = data.val()
          })
      })
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    removeFriendWarning() {
      this.showRemoveFriendWarning = true
    },
    getSchedule() {
      let schedule = this.schedule.weekday
      const day = moment()
        .tz(this.timezone)
        .format('dddd')
      if (day === 'Saturday' || day === 'Sunday') {
        schedule = this.schedule.weekend
      }
      return schedule
    },
    getActiveActivity() {
      const routine = this.getSchedule().routine
      for (const activity in routine) {
        const activityStartTime = this.getMomentDateWithTime(
          routine[activity].startTime
        )
        const activityEndTime = this.getMomentDateWithTime(
          moment(routine[activity].startTime, 'HH:mm:ss')
            .add(routine[activity].duration, 'h')
            .format('HH:mm:ss')
        )
        const currentTime = this.getMomentDateWithTime(
          moment.tz(this.timezone).format('HH:mm:ss')
        )
        if (
          currentTime.isAfter(activityStartTime) &&
          currentTime.isBefore(activityEndTime)
        ) {
          return activity
        }
      }
    },
    isDayActive() {
      const schedule = this.getSchedule()
      const dayStartTime = this.getMomentDateWithTime(schedule.dayStartTime)
      const dayEndTime = this.getMomentDateWithTime(schedule.dayEndTime)
      const currentTime = this.getMomentDateWithTime(
        moment.tz(this.timezone).format('HH:mm:ss')
      )
      if (
        currentTime.isAfter(dayStartTime) &&
        currentTime.isBefore(dayEndTime)
      ) {
        return true
      } else {
        return false
      }
    },
    getMomentDateWithTime(timeStr) {
      const timeArr = timeStr.split(':')
      return moment().set({
        hour: timeArr[0],
        minute: timeArr[1],
        second: timeArr[2]
      })
    },
    callPhone(phone) {
      window.open('tel:' + phone, '_self')
    },
    sendTextMessage(phone) {
      window.open('sms:' + phone, '_self')
    },
    sendWhatsAppMessage(phone) {
      window.open('https://wa.me/' + phone, '_self')
    },
    sendEmailMessage(email) {
      window.open('mailto:' + email, '_self')
    },
    removeFriend() {
      const vm = this
      firebaseDB.ref('friends/' + vm.uid + '/' + vm.friendId).set(null)
      vm.$emit('friendRemoved', vm.friend)
    }
  }
}
</script>
