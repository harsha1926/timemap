<template>
  <v-app id="timeMap">
    <v-app-bar app color="#ffffff">
      <v-avatar tile size="30">
        <v-img src="/icon.png"></v-img>
      </v-avatar>
      <span class="appTitle primary--text">TIMEMAP</span>
      <v-row justify="end" align="center">
        <span v-if="displayName" class="appGreeting mr-5 d-none d-sm-block"
          >Hello {{ displayName }}</span
        >
        <v-btn fab icon to="/account">
          <v-avatar v-if="photoURL" class size="40">
            <v-img :src="photoURL"></v-img>
          </v-avatar>
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <login v-if="!uid"></login>
        <verify-phone v-else-if="uid && !phoneNumber"></verify-phone>
        <nuxt v-else-if="uid && phoneNumber"></nuxt>
      </v-container>
    </v-content>

    <v-bottom-navigation v-if="uid" :value="activeTab" grow color="primary" app>
      <v-btn to="/">
        <span>Friends</span>
        <v-icon small>mdi-heart</v-icon>
      </v-btn>
      <v-btn to="/findFriends">
        <span>Find Friends</span>
        <v-icon small>fas fa-search</v-icon>
      </v-btn>
      <v-btn to="/familyTree">
        <span>Family Tree</span>
        <v-icon small>fas fa-sitemap</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase'
import Login from '~/components/login/Login'
import VerifyPhone from '~/components/login/VerifyPhone'
export default {
  components: {
    Login,
    VerifyPhone
  },
  data: () => ({
    on: false,
    activeTab: 0
  }),
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL']),
    ...mapGetters('user/phone', ['phoneNumber'])
  },
  watch: {
    uid: {
      handler(newVal) {
        if (newVal) {
          this.getUserCurrentLocation(newVal)
        }
      }
    }
  },
  methods: {
    ...mapActions('user/currentLocation', ['addCurrentLocation']),
    getActiveTab() {
      if (this.$route.path.includes('findFriends')) {
        return 1
      }
      if (this.$route.path.includes('familyTree')) {
        return 2
      }
      return 0
    },
    getUserCurrentLocation(uid) {
      const vm = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          firebase
            .database()
            .ref('users')
            .child(uid)
            .update({
              currentLocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            })
          vm.addCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        })
      }
    }
  }
}
</script>
<style scoped>
.appTitle {
  font-size: 24px;
  font-family: 'Turret Road', cursive;
  font-weight: 900;
}
.appGreeting {
  font-size: 12px;
  font-family: 'Lexend Mega', sans-serif;
}
.v-bottom-navigation {
  padding: 1px !important;
}
.v-bottom-navigation .v-btn {
  height: inherit !important;
}
</style>
