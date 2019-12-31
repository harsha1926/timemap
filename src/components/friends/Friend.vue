<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''">
    <v-skeleton-loader v-if="loading" type="card-avatar"></v-skeleton-loader>
    <v-row v-else-if="friend">
      <v-col cols="2">
        <v-avatar size="35">
          <v-img :src="friend.photoURL"></v-img>
        </v-avatar>
      </v-col>

      <v-col cols="8">
        <v-row align="center">
          <v-flex class="subtitle-1 font-weight-medium">
            {{ displayNameCaptilize }}
            <span class="subtitle-2 font-weight-regular">
              {{ activityHeading }}
            </span>
          </v-flex>
        </v-row>
        <v-row>
          <v-flex class="caption">{{ localTimeFormattedString }}</v-flex>
        </v-row>
      </v-col>

      <v-col cols="2" class="text-right">
        <v-icon class="customPointer" color="primary">mdi-heart-outline</v-icon>
      </v-col>
    </v-row>

    <v-row>
      <v-img :src="activityPhoto" content>
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-row>
        </template>
        <v-row
          justify="end"
          align="end"
          class="caption font-weight-light ma-1 pa-1 fill-height white--text"
          >Powered By Tenor</v-row
        >
      </v-img>
    </v-row>

    <v-row>
      <v-col cols="2">
        <v-icon
          @click="sendWhatsAppMessage(friend.phoneNumber)"
          class="customPointer"
          color="primary"
          >mdi-whatsapp</v-icon
        >
      </v-col>
      <v-col cols="2">
        <v-icon
          @click="callPhone(friend.phoneNumber)"
          class="customPointer"
          color="primary"
          >mdi-phone</v-icon
        >
      </v-col>
      <v-col cols="2">
        <v-icon
          @click="sendTextMessage(friend.phoneNumber)"
          class="customPointer"
          color="primary"
          >mdi-message-outline</v-icon
        >
      </v-col>
      <v-col cols="2">
        <v-icon
          @click="sendEmailMessage(friend.email)"
          class="customPointer"
          color="primary"
          >mdi-email-outline</v-icon
        >
      </v-col>
      <v-col cols="4" class="text-right">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="customPointer" color="primary"
              >mdi-dots-vertical</v-icon
            >
          </template>
          <v-list>
            <v-list-item @click="removeFriendWarning">
              <v-list-item-title>
                <v-icon class="customPointer" color="error">mdi-delete</v-icon>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <div style="background-color:#D8D8D8; height: 5px; width:100%;"></div>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import { fetchTimezone } from '@/api/timezone'
import { firebaseDB } from '@/services/firebaseInit.js'
import { fetchRandomGIF } from '@/api/tenorGIFs'

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
          this.getRandomGIF()
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
    getRandomGIF() {
      if (this.activity) {
        let search = 'funny'
        if (this.activity === 'sleep') {
          search = 'sleeping'
        } else if (this.activity === 'breakfast' || this.activity === 'lunch') {
          search = 'eating'
        } else if (this.activity === 'dinner') {
          search = 'dinner'
        } else if (this.activity === 'work') {
          search = 'working'
        } else if (this.activity === 'free') {
          search = 'im free'
        }

        fetchRandomGIF(search).then((res) => {
          if (this.$vuetify.breakpoint.xsOnly) {
            this.activityPhoto = res.data.results[0].media[0].tinygif.url
          } else {
            this.activityPhoto = res.data.results[0].media[0].gif.url
          }
        })
      }
    },
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
