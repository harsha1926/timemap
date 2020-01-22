<template>
  <v-app id="watch">
    <v-app-bar :dense="$vuetify.breakpoint.xsOnly" app tile flat>
      <v-row align="center">
        <v-flex @click="$router.push('/')" class="customPointer text-left">
          <v-avatar size="35">
            <v-img :src="iconURL"></v-img>
          </v-avatar>
          <span class="ml-2 appTitleFont primary--text">Watch</span>
        </v-flex>
        <v-flex class="text-right">
          <v-row justify="end" align="center">
            <span v-if="displayName" class="mr-5 d-none d-sm-block"
              >Hello {{ displayName }}</span
            >
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
    </v-app-bar>
    <v-content>
      <v-divider></v-divider>
      <v-container fluid class="mt-0 pt-0">
        <login v-if="!uid"></login>
        <verify-phone v-else-if="uid && !phoneNumber"></verify-phone>
        <nuxt v-else-if="uid && phoneNumber"></nuxt>
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-if="uid"
      :height="$vuetify.breakpoint.xsOnly ? 40 : 65"
      active.sync="activeTab"
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
    </v-bottom-navigation>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Login from '~/components/login/Login'
import VerifyPhone from '~/components/login/VerifyPhone'
import { fetchRandomGIF } from '@/api/gifs'
export default {
  components: {
    Login,
    VerifyPhone
  },
  data: () => ({
    activeTab: null,
    on: false,
    showSearchBar: false,
    iconURL:
      'https://media.tenor.com/images/7d0204ed76b90079d9bf2402369f8df9/tenor.gif'
  }),
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL', 'phoneNumber'])
  },
  created() {
    const vm = this
    setInterval(function() {
      fetchRandomGIF('clock').then((res) => {
        vm.iconURL = res.data.results[0].media[0].tinygif.url
      })
    }, 5000)
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
