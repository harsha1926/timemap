<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto"
      type="card-avatar"
    ></v-skeleton-loader>
    <v-card v-else>
      <v-img
        :src="activityPhoto"
        height="200px"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-row class="ma-2 userTime" justify="end">{{ friend.time }}</v-row>
        <v-row class="ma-3 activityHeading" justify="start"
          >{{ friend.displayName }} {{ activityHeading }}</v-row
        >
        <v-card-text class="statusText">{{ statusText }}</v-card-text>
      </v-img>

      <v-card-actions>
        <v-row align="center">
          <v-flex>
            <v-avatar size="80" color="grey darken-3 ml-3 mr-3">
              <v-img :src="friend.photoURL" class="elevation-6"></v-img>
            </v-avatar>
          </v-flex>
          <v-flex>
            <v-btn
              @click="sendEmailMessage(friend.email)"
              icon
              fab
              color="primary"
            >
              <v-icon>far fa-envelope</v-icon>
            </v-btn>
            <v-btn
              @click="sendTextMessage(friend.phoneNumber)"
              :disabled="!friend.phoneNumber"
              icon
              fab
              color="primary"
            >
              <v-icon>mdi-message</v-icon>
            </v-btn>
            <v-btn
              @click="callPhone(friend.phoneNumber)"
              :disabled="!friend.phoneNumber"
              icon
              fab
              color="primary"
            >
              <v-icon>fas fa-phone</v-icon>
            </v-btn>
            <v-btn
              @click="sendWhatsAppMessage(friend.phoneNumber)"
              :disabled="!friend.phoneNumber"
              icon
              fab
              color="primary"
            >
              <v-icon>fab fa-whatsapp</v-icon>
            </v-btn>
          </v-flex>
        </v-row>
      </v-card-actions>
      <v-btn
        @click="removeFriend"
        color="primary"
        x-small
        absolute
        top
        right
        fab
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    friend: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
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
      if (this.friend.status) return this.user.status
      else if (this.friend.activity === 'sleep') return 'Sleeping now..'
      else if (this.friend.activity === 'breakfast') return 'Eating...'
      else if (this.friend.activity === 'work') return 'Busy now..'
      else if (this.friend.activity === 'free') return 'Available now..'
      else return ''
    }
  },
  methods: {
    ...mapActions({
      removeFriendAction: 'friends/removeFriend'
    }),
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
        .ref(
          'users/' +
            vm.encodeEmail(vm.user.email) +
            '/friends/' +
            vm.encodeEmail(vm.friend.email)
        )
        .set(null)
      vm.$emit('friendRemoved', vm.friend)
      vm.removeFriendAction(vm.friend)
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
