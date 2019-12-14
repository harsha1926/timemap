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
        <v-row class="ma-3 activityHeading" justify="start">{{ activityHeading }}</v-row>
      </v-img>

      <v-card-text class="mt-0 mb-0 pt-0 pb-0">
        <v-row align="center">
          <v-col cols="3">
            <v-avatar color="grey darken-3">
              <v-img :src="friend.photoURL" class="elevation-6"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="9">
            <span class="displayName font-weight-bold">{{ friend.displayName }}</span>
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
            <v-avatar @click="sendTextMessage(fullPhoneNumber)" :disabled="!friend.phone">
              <v-icon color="primary">mdi-message</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar @click="callPhone(fullPhoneNumber)" :disabled="!friend.phone">
              <v-icon color="primary">fas fa-phone</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar @click="sendWhatsAppMessage(fullPhoneNumber)" :disabled="!friend.phone">
              <v-icon color="primary">fab fa-whatsapp</v-icon>
            </v-avatar>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-btn @click="removeFriend" color="primary" x-small absolute top right fab>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import { fetchTimezone } from '@/api/timezone'
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
      timeZone: null,
      loading: false,
      friend: null,
      schedule: null,
      now: new Date(),
      dummyDate: '06/19/1990'
    }
  },
  created() {
    var vm = this
    setInterval(function() {
      vm.now = new Date()
    }, 60000)
  },
  computed: {
    ...mapGetters('user', ['uid']),
    localTimeFormattedString() {
      if (this.timeZone) {
        return this.now.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZone: this.timeZone
        })
      } else {
        return '...'
      }
    },
    localTime() {
      if (this.timeZone) {
        return this.now.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
          timeZone: this.timeZone
        })
      } else {
        return null
      }
    },
    fullPhoneNumber() {
      if (this.friend)
        return (
          '+' + this.friend.phone.callingCode + this.friend.phone.phoneNumber
        )
      else return null
    },
    activity() {
      if (!this.schedule) return null
      else {
        if (this.localTime) {
          let dayStartTime = this.schedule.awake.startTime
          let dayEndTime = this.schedule.awake.endTime
          if (this.isAfter(dayStartTime) && this.isBefore(dayEndTime)) {
            let breakfastStartTime = this.schedule.breakfast.startTime
            let breakfastEndTime = this.schedule.breakfast.endTime
            if (
              this.isAfter(breakfastStartTime) &&
              this.isBefore(breakfastEndTime)
            ) {
              return 'breakfast'
            }
            let lunchStartTime = this.schedule.lunch.startTime
            let lunchEndTime = this.schedule.lunch.endTime
            if (this.isAfter(lunchStartTime) && this.isBefore(lunchEndTime)) {
              return 'lunch'
            }
            let workStartTime = this.schedule.work.startTime
            let workEndTime = this.schedule.work.endTime
            if (this.isAfter(workStartTime) && this.isBefore(workEndTime)) {
              return 'work'
            }
            let dinnerStartTime = this.schedule.dinner.startTime
            let dinnerEndTime = this.schedule.dinner.endTime
            if (this.isAfter(dinnerStartTime) && this.isBefore(dinnerEndTime)) {
              return 'dinner'
            } else {
              return 'free'
            }
          } else {
            return 'sleep'
          }
        } else {
          return null
        }
      }
    },
    activityPhoto() {
      if (this.activity) {
        if (this.activity === 'sleep')
          return 'https://media.tenor.com/images/e498a53565bac7f47dd901c0676ccc53/tenor.gif'
        else if (this.activity === 'breakfast')
          return 'https://i.pinimg.com/originals/49/41/f7/4941f71d1121dd336e50bf2ec1c0f817.gif'
        else if (this.activity === 'work')
          return 'https://media.tenor.com/images/c18c487d770dbaef16ea7521cfe4f7d2/tenor.gif'
        else if (this.activity === 'lunch')
          return 'https://i.pinimg.com/originals/49/41/f7/4941f71d1121dd336e50bf2ec1c0f817.gif'
        else if (this.activity === 'dinner')
          return 'https://i.pinimg.com/originals/49/41/f7/4941f71d1121dd336e50bf2ec1c0f817.gif'
        else if (this.activity === 'free')
          return 'https://media.tenor.com/images/86002300e062cd49c4e5eac9748f7546/tenor.gif'
        else return ''
      } else {
        return ''
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
        return ''
      }
    }
  },
  mounted() {
    if (this.friendId) {
      const vm = this
      firebase
        .database()
        .ref('users/' + vm.friendId)
        .once('value', function(data) {
          vm.friend = data.val()
          if (vm.friend.currentLocation) {
            fetchTimezone(
              vm.friend.currentLocation.latitude,
              vm.friend.currentLocation.longitude,
              Date.now() / 1000
            ).then((res) => {
              vm.timeZone = res.data.timeZoneId
            })
          }
        })

      firebase
        .database()
        .ref('schedule/' + vm.friendId)
        .once('value', function(data) {
          if (data.val()) vm.schedule = data.val()
          else
            firebase
              .database()
              .ref('schedule/default')
              .once('value', function(data) {
                vm.schedule = data.val()
              })
        })
    }
  },
  methods: {
    isAfter(time) {
      return (
        Date.parse(this.dummyDate + ' ' + this.localTime) >
        Date.parse(this.dummyDate + ' ' + time)
      )
    },
    isBefore(time) {
      return (
        Date.parse(this.dummyDate + ' ' + this.localTime) <
        Date.parse(this.dummyDate + ' ' + time)
      )
    },
    callPhone(phone) {
      window.open('tel:' + phone)
    },
    sendTextMessage(phone) {
      window.open('sms:' + phone)
    },
    sendWhatsAppMessage(phone) {
      window.open('https://wa.me/' + phone)
    },
    sendEmailMessage(email) {
      window.open('mailto:' + email)
    },
    removeFriend() {
      const vm = this
      firebase
        .database()
        .ref('friends/' + vm.uid + '/' + vm.friendId)
        .set(null)
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
}
.userTime {
  font-family: 'Lexend Mega', sans-serif;
  color: #ffffff;
}
.statusText {
  font-family: 'Lexend Mega', sans-serif;
  font-size: 10px;
  font-weight: 100;
  color: #d1cdcd;
}
</style>
