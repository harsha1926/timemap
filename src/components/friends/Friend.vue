<template>
  <div>
    <v-skeleton-loader v-if="loading" class="mx-auto" type="card-avatar"></v-skeleton-loader>
    <v-card v-else-if="friend">
      <v-img
        :src="activityPhoto"
        height="200px"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-row class="ma-2 userTime" justify="start">{{ localTimeFormattedString }}</v-row>
        <v-row class="ma-2 activityHeading" justify="start">{{ activityHeading }}</v-row>
        <v-row class="ma-3 quote" justify="start">{{ activityQuote }}</v-row>
      </v-img>

      <v-card-text class="mt-0 mb-0 pt-0 pb-0">
        <v-row align="center">
          <v-col cols="3">
            <v-avatar color="grey darken-3">
              <v-img :src="friend.photoURL" class="elevation-6"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="9">
            <span class="displayName font-weight-bold">{{ displayNameCaptilize }}</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-0 mb-0 pt-0 pb-0">
        <v-row>
          <v-col cols="3">
            <v-avatar @click="sendEmailMessage(friend.email)">
              <v-icon color="primary">far fa-envelope</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar @click="sendTextMessage(friend.phoneNumber)" :disabled="!friend.phoneNumber">
              <v-icon color="primary">mdi-message</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar @click="callPhone(friend.phoneNumber)" :disabled="!friend.phoneNumber">
              <v-icon color="primary">fas fa-phone</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar
              @click="sendWhatsAppMessage(friend.phoneNumber)"
              :disabled="!friend.phoneNumber"
            >
              <v-icon color="primary">fab fa-whatsapp</v-icon>
            </v-avatar>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-row>
        <span class="lastUpdated mb-3 ml-5">Last updated at {{ lastUpdatedString }}</span>
      </v-row>
      <v-btn @click="removeFriendWarning" color="primary" x-small absolute top right fab>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card>
    <v-dialog v-model="showRemoveFriendWarning" max-width="400">
      <v-card>
        <v-card-title class="removeFriendWarning">Are you sure?</v-card-title>
        <v-card-actions>
          <v-btn @click="removeFriend">Yes</v-btn>
          <v-btn color="primary" @click="showRemoveFriendWarning = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
        if (this.activity === 'sleep') return 'I am sleeping..'
        else if (this.activity === 'breakfast')
          return 'I am having my breakfast..'
        else if (this.activity === 'work') return 'I am at work now..'
        else if (this.activity === 'lunch') return 'I am having my lunch..'
        else if (this.activity === 'dinner') return 'I am having my dinner..'
        else if (this.activity === 'free') return 'I am free now..'
        else return ''
      } else {
        return "I don't know.."
      }
    }
  },
  watch: {
    activity: {
      handler(newVal) {
        if (newVal) {
          const vm = this
          firebaseDB
            .ref('gifs')
            .orderByChild('activity')
            .limitToLast(1)
            .equalTo(newVal)
            .once('value', function(snapshot) {
              snapshot.forEach((data) => {
                if (data.val()) vm.activityPhoto = data.val().url
              })
            })

          firebaseDB
            .ref('quotes')
            .orderByChild('activity')
            .limitToLast(1)
            .equalTo(newVal)
            .once('value', function(snapshot) {
              snapshot.forEach((data) => {
                if (data.val()) vm.activityQuote = data.val().quote
              })
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
      firebaseDB.ref('users/' + vm.friendId).once('value', function(data) {
        vm.friend = data.val()
        if (vm.friend.currentLocation) {
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
<style scoped>
.displayName {
  font-family: 'Lexend Mega', sans-serif;
}
.activityHeading {
  font-family: 'Lexend Mega', sans-serif;
  color: #ffffff;
  font-size: 22px;
}
.userTime {
  font-family: 'Lexend Mega', sans-serif;
  color: #ffffff;
  font-size: 12px;
}
.quote {
  font-family: 'Lexend Mega', sans-serif;
  font-size: 10px;
  color: #dad5d5;
}
.lastUpdated {
  font-family: 'Lexend Mega', sans-serif;
  font-size: 9px;
  color: #c0bcbc;
}
.removeFriendWarning {
  font-family: 'Lexend Mega', sans-serif;
  font-size: 20px;
}
</style>
