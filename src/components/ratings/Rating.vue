<template>
  <v-container
    :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''"
    @click="showFriendPhoto = false"
  >
    <v-row v-if="loading">
      <v-col cols="12">
        <v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card v-else-if="friend">
      <v-row justify="space-between">
        <v-col cols="8">
          <v-card-title primary-title class="headline">
            {{ displayNameCaptilize }}
          </v-card-title>
          <v-card-actions>
            <v-rating
              v-model="rating"
              :length="5"
              :half-increments="false"
              :size="30"
              empty-icon="mdi-heart-outline"
              full-icon="mdi-heart"
              half-icon="mdi-heart-half-full"
              hover="true"
              color="primary"
              background-color="grey"
            ></v-rating>
          </v-card-actions>
        </v-col>
        <v-col cols="4">
          <v-img :src="friend.photoURL" contain height="125px"></v-img>
        </v-col>
      </v-row>
    </v-card>
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
    gifs: {
      type: Array,
      default() {
        return []
      }
    },
    friendId: {
      type: String,
      default() {
        return null
      }
    },
    isFavourite: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      showFriendPhoto: false,
      timezone: null,
      loading: false,
      friend: null,
      schedule: null,
      now: new Date(),
      activityPhoto: '',
      lastUpdated: null,
      showRemoveFriendWarning: false,
      activityObj: null,
      isFavouriteLoading: false,
      rating: null
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    height() {
      return this.$vuetify.breakpoint.xsOnly ? '180px' : '250px'
    },
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
          if (this.isAwake()) {
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
    activityGIFs() {
      return this.gifs.filter(
        (o) => o.activity === this.activity && !o.forAvatar
      )
    }
  },
  watch: {
    activity: {
      handler(newVal) {
        if (newVal) {
          this.getRandomGIF()
          this.getActivityObject()
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
    addToFavourite() {
      const vm = this
      vm.isFavouriteLoading = true
      firebaseDB
        .ref('watching/' + vm.uid + '/' + vm.friendId)
        .update({ isFavourite: !vm.isFavourite })
        .then(() => {
          setTimeout(() => {
            vm.$emit('favourite-updated', {
              uid: vm.friendId,
              isFavourite: !vm.isFavourite
            })
            vm.isFavouriteLoading = false
          }, 1000)
        })
    },
    getActivityObject() {
      if (this.activity) {
        if (this.activity === 'sleep') {
          this.activityObj = { id: 'sleep', indirect: 'is sleeping' }
        } else if (this.activity === 'free') {
          this.activityObj = { id: 'free', indirect: 'is free' }
        } else {
          const vm = this
          firebaseDB
            .ref('activities')
            .orderByChild('id')
            .equalTo(this.activity)
            .once('value', function(data) {
              data.forEach((o) => {
                vm.activityObj = o.val()
              })
            })
        }
      }
    },
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getRandomGIF() {
      if (this.activity && this.activityGIFs && this.activityGIFs.length > 0) {
        const randomInt = this.getRndInteger(0, this.activityGIFs.length - 1)
        this.activityPhoto = this.activityGIFs[randomInt].url
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    removeFriendWarning() {
      this.showRemoveFriendWarning = true
    },
    getSchedule() {
      const day = moment()
        .tz(this.timezone)
        .format('dddd')
      return this.schedule.find((o) => o.day === day.toLowerCase())
    },
    getActiveActivity() {
      const routine = this.getSchedule()
      if (routine && routine.activities) {
        for (let i = 0; i < routine.activities.length; i++) {
          const activity = routine.activities[i]
          if (activity.startTime && activity.endTime) {
            const activityStartTime = this.getMomentDateWithTime(
              activity.startTime
            )
            const currentTime = this.getMomentDateWithTime(
              moment.tz(this.timezone).format('HH:mm')
            )
            const activityEndTime = this.getMomentDateWithTime(activity.endTime)
            if (
              currentTime.isAfter(activityStartTime) &&
              currentTime.isBefore(activityEndTime)
            ) {
              return activity.id
            }
          }
        }
      }
    },
    isAwake() {
      const routine = this.getSchedule()
      const dayStartTime = this.getMomentDateWithTime(routine.dayStartTime)
      const dayEndTime = this.getMomentDateWithTime(routine.dayEndTime)
      const currentTime = this.getMomentDateWithTime(
        moment.tz(this.timezone).format('HH:mm')
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
      firebaseDB.ref('watching/' + vm.uid + '/' + vm.friendId).set(null)
      vm.$emit('friendRemoved', vm.friend)
    }
  }
}
</script>
