<template>
  <v-app id="timeMap">
    <v-app-bar app color="#ffffff" hide-on-scroll dense>
      <v-row justify="start" align="center">
        <v-col @click="$router.push('/')">
          <v-row justify="start" align="center" class="customPointer ml-1">
            <v-avatar tile size="35">
              <v-img src="/icon.png"></v-img>
            </v-avatar>
            <span class="appTitle primary--text ml-1">TIMEMAP</span>
          </v-row>
        </v-col>
        <v-col>
          <v-row justify="end" align="center">
            <v-btn to="/findFriends" icon fab small class="ma-2">
              <v-icon>fas fa-search-plus</v-icon>
            </v-btn>
            <span v-if="displayName" class="appGreeting mr-5 d-none d-sm-block"
              >Hello {{ displayName }}</span
            >
            <v-btn fab icon to="/account">
              <v-avatar v-if="photoURL" size="40">
                <v-img :src="photoURL"></v-img>
              </v-avatar>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <login v-if="!uid"></login>
        <verify-phone v-else-if="uid && !phoneNumber"></verify-phone>
        <nuxt v-else-if="uid && phoneNumber"></nuxt>
      </v-container>
    </v-content>

    <v-bottom-navigation
      v-if="uid"
      :value="activeTab"
      grow
      shift
      color="primary"
      height="48"
      app
    >
      <v-btn small to="/">
        <span class="bottomNav caption">Friends</span>
        <v-icon small>mdi-heart</v-icon>
      </v-btn>
      <v-btn small to="/schedule">
        <span class="bottomNav caption">My Routine</span>
        <v-icon small>far fa-calendar-check</v-icon>
      </v-btn>
      <v-btn small to="/share">
        <span class="bottomNav caption">Family Tree</span>
        <v-icon small>fas fa-sitemap</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Login from '~/components/login/Login'
import VerifyPhone from '~/components/login/VerifyPhone'
export default {
  components: {
    Login,
    VerifyPhone
  },
  data: () => ({
    on: false,
    activeTab: 0,
    showSearchBar: false
  }),
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL', 'phoneNumber'])
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
.bottomNav {
  font-family: 'Lexend Mega', sans-serif;
}
</style>
