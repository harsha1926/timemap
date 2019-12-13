<template>
  <div>
    <v-skeleton-loader v-if="loading" class="mx-auto" type="card-avatar"></v-skeleton-loader>
    <v-card v-else-if="friend">
      <v-img
        :src="activityPhoto"
        height="200px"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-row class="ma-2 userTime" justify="end">{{ localTime }}</v-row>
        <v-row
          class="ma-3 activityHeading"
          justify="start"
        >{{ friend.displayName }} {{ activityHeading }}</v-row>
        <v-card-text class="statusText">{{ statusText }}</v-card-text>
      </v-img>

      <v-card-actions>
        <v-row align="center">
          <v-col cols="3">
            <v-avatar color="grey darken-3">
              <v-img :src="friend.photoURL" class="elevation-6"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="2">
            <v-avatar @click="sendEmailMessage(friend.email)">
              <v-icon color="primary">far fa-envelope</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="2">
            <v-avatar @click="sendTextMessage(fullPhoneNumber)" :disabled="!friend.phone">
              <v-icon color="primary">mdi-message</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="2">
            <v-avatar @click="callPhone(fullPhoneNumber)" :disabled="!friend.phone">
              <v-icon color="primary">fas fa-phone</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="2">
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
      now: new Date()
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
    localTime() {
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
    fullPhoneNumber() {
      if (this.friend)
        return (
          '+' + this.friend.phone.callingCode + this.friend.phone.phoneNumber
        )
      else return null
    },
    activityIcon() {
      if (this.friend.activity === 'sleep') return 'fas fa-bed'
      else if (this.friend.activity === 'breakfast') return 'fas fa-utensils'
      else if (this.friend.activity === 'work') return 'fas fa-business-time'
      else if (this.friend.activity === 'free') return 'fas fa-umbrella-beach'
      else return ''
    },
    activityPhoto() {
      if (this.friend.activity === 'sleep')
        return 'https://media.tenor.com/images/e498a53565bac7f47dd901c0676ccc53/tenor.gif'
      else if (this.friend.activity === 'breakfast')
        return 'https://i.pinimg.com/originals/49/41/f7/4941f71d1121dd336e50bf2ec1c0f817.gif'
      else if (this.friend.activity === 'work')
        return 'https://media.tenor.com/images/c18c487d770dbaef16ea7521cfe4f7d2/tenor.gif'
      else if (this.friend.activity === 'free')
        return 'https://media.tenor.com/images/86002300e062cd49c4e5eac9748f7546/tenor.gif'
      else
        return 'https://media.tenor.com/images/86002300e062cd49c4e5eac9748f7546/tenor.gif'
    },
    activityHeading() {
      if (this.friend.activity === 'sleep') return ' is sleeping now..'
      else if (this.friend.activity === 'breakfast') return ' is eating...'
      else if (this.friend.activity === 'work') return ' is busy now..'
      else if (this.friend.activity === 'free') return ' is available now..'
      else return ''
    },
    statusText() {
      if (this.friend.status) return this.status
      else if (this.friend.activity === 'sleep') return 'Sleeping now..'
      else if (this.friend.activity === 'breakfast') return 'Eating...'
      else if (this.friend.activity === 'work') return 'Busy now..'
      else if (this.friend.activity === 'free') return 'Available now..'
      else return ''
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
    }
  },
  methods: {
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
