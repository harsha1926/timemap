<template>
  <v-app id="watch">
    <v-app-bar :dense="$vuetify.breakpoint.xsOnly" app tile flat>
      <v-container fluid class="pa-0 ma-0">
        <v-row align="center" class="mb-1">
          <v-flex @click="$router.push('/')" class="customPointer text-left">
            <v-row justify="start" align="center" class="ml-2">
              <v-avatar size="35">
                <v-img :src="iconURL"></v-img>
              </v-avatar>
              <span class="ml-3 appTitleFont primary--text">Watch</span>
            </v-row>
          </v-flex>
          <v-flex class="text-right">
            <v-row justify="end" align="center">
              <span v-if="displayName" class="mr-5 d-none d-sm-block">Hello {{ displayName }}</span>
              <v-avatar
                @click="$router.push('/account')"
                v-if="photoURL"
                class="mr-5 customPointer"
                size="35"
              >
                <v-img :src="photoURL"></v-img>
              </v-avatar>
            </v-row>
          </v-flex>
        </v-row>
        <v-row>
          <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container fluid class="mt-0 pt-0">
        <login v-if="!uid"></login>
        <verify-phone v-else-if="uid && !phoneNumber"></verify-phone>
        <nuxt v-else-if="uid && phoneNumber"></nuxt>
      </v-container>
    </v-content>

    <v-footer app>
      <v-container fluid class="pa-0 ma-0">
        <v-row>
          <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
        </v-row>
        <v-row row align="center" justify="space-between" class="mt-1">
          <v-flex class="text-center">
            <v-btn color="primary" text to="/" value="home">
              <v-icon>fas fa-eye</v-icon>
            </v-btn>
          </v-flex>

          <v-flex class="text-center">
            <v-btn color="primary" text to="/findFriends" value="findFriends">
              <v-icon>fas fa-search</v-icon>
            </v-btn>
          </v-flex>

          <v-flex class="text-center">
            <v-btn color="primary" text to="/schedule" value="schedule">
              <v-icon>far fa-calendar-check</v-icon>
            </v-btn>
          </v-flex>

          <v-flex class="text-center">
            <v-btn color="primary" text to="/posts" value="posts">
              <v-icon>fas fa-angle-double-up</v-icon>
            </v-btn>
          </v-flex>
        </v-row>
      </v-container>
    </v-footer>

    <!-- <v-bottom-navigation
      v-if="uid"
      :height="$vuetify.breakpoint.xsOnly ? 45 : 65"
      v-model="activeTab"
      color="primary"
      grow
      app
    >
      <v-btn to="/" value="home">
        <v-icon>fas fa-eye</v-icon>
      </v-btn>
      <v-btn to="/findFriends" value="findFriends">
        <v-icon>fas fa-search</v-icon>
      </v-btn>
      <v-btn to="/schedule" value="schedule">
        <v-icon>far fa-calendar-check</v-icon>
      </v-btn>
      <v-btn to="/posts" value="posts">
        <v-icon>fas fa-angle-double-up</v-icon>
      </v-btn>
    </v-bottom-navigation>-->
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
    activeTab: 0,
    on: false,
    showSearchBar: false,
    iconURL:
      'https://media1.tenor.com/images/e9aa112a4646871f63345e167557eae1/tenor.gif?itemid=12827256'
  }),
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL', 'phoneNumber'])
  },
  methods: {
    ...mapActions('user/currentLocation', ['addCurrentLocation'])
  }
}
</script>
<style scoped>
.v-bottom-navigation {
  padding: 1px !important;
}
.v-bottom-navigation .v-btn {
  height: inherit !important;
}
</style>
