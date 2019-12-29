<template>
  <v-app id="timeMap">
    <v-app-bar app hide-on-scroll dense tile flat>
      <v-row>
        <v-flex class="text-left">
          <v-avatar
            @click="$router.push('/')"
            class="ml-2 customPointer"
            tile
            size="35"
          >
            <v-img src="/icon.png"></v-img>
          </v-avatar>
        </v-flex>
        <v-flex class="text-right">
          <v-row justify="end" align="center">
            <v-icon
              @click="$router.push('/findFriends')"
              v-if="uid"
              class="mr-5"
              small
              >fas fa-search</v-icon
            >
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
      <v-container fluid>
        <login v-if="!uid"></login>
        <verify-phone v-else-if="uid && !phoneNumber"></verify-phone>
        <nuxt v-else-if="uid && phoneNumber"></nuxt>
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-if="uid"
      v-model="activeTab"
      color="primary"
      grow
      shift
      height="48"
      app
    >
      <v-btn small to="/">
        <span class="caption">Friends</span>
        <v-icon small>mdi-heart</v-icon>
      </v-btn>
      <v-btn small to="/schedule">
        <span class="caption">My Routine</span>
        <v-icon small>far fa-calendar-check</v-icon>
      </v-btn>
      <v-btn small to="/share">
        <span class="caption">Family Tree</span>
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
