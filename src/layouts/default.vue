<template>
  <v-app id="watch">
    <v-app-bar color="#ffffff" :dense="$vuetify.breakpoint.xsOnly" app tile flat>
      <v-container fluid class="ma-0 pa-0" style="background-color:#ffffff;">
        <v-row align="center" class="mb-1">
          <v-flex @click="$router.push('/')" class="customPointer text-left">
            <v-row justify="start" align="center" class="ml-2">
              <span class="ml-3 appTitleFont primary--text">Just Restart</span>
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

    <v-footer :height="$vuetify.breakpoint.xsOnly ? 45 : 60" color="white" app>
      <v-container fluid class="fill-height pa-0 ma-0">
        <v-row>
          <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
        </v-row>
        <v-row row align="center" justify="space-between" class="mt-1">
          <v-flex @click="$router.push('/')" class="text-center">
            <v-icon v-if="currentPage && currentPage === '/'" color="primary">fas fa-home</v-icon>
            <v-icon v-else color="grey">fas fa-home</v-icon>
          </v-flex>

          <v-flex @click="$router.push('/friends')" class="text-center">
            <v-icon
              v-if="currentPage && currentPage.startsWith('/friends')"
              color="primary"
            >fas fa-eye</v-icon>
            <v-icon v-else color="grey">far fa-eye</v-icon>
          </v-flex>

          <v-flex @click="$router.push('/posts')" class="text-center">
            <v-icon
              v-if="currentPage && currentPage.startsWith('/posts')"
              color="primary"
            >fas fa-angle-double-up</v-icon>
            <v-icon v-else color="grey">fas fa-angle-double-up</v-icon>
          </v-flex>

          <v-flex @click="$router.push('/findFriends')" class="text-center">
            <v-icon
              v-if="currentPage && currentPage.startsWith('/findFriends')"
              color="primary"
            >fas fa-user-plus</v-icon>
            <v-icon v-else color="grey">fas fa-user-plus</v-icon>
          </v-flex>

          <v-flex @click="$router.push('/schedule')" class="text-center">
            <v-icon
              v-if="currentPage && currentPage.startsWith('/schedule')"
              color="primary"
            >fas fa-calendar-check</v-icon>
            <v-icon v-else color="grey">far fa-calendar-check</v-icon>
          </v-flex>
        </v-row>
      </v-container>
    </v-footer>
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
    showSearchBar: false,
    iconURL:
      'https://media1.tenor.com/images/e9aa112a4646871f63345e167557eae1/tenor.gif?itemid=12827256'
  }),
  middleware: 'currentPage',
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL', 'phoneNumber']),
    ...mapGetters('app', ['currentPage'])
  },
  mounted() {
    this.$store.dispatch(
      'app/updateCurrentPage',
      this.$router.currentRoute.path
    )
  },
  methods: {
    ...mapActions('user/currentLocation', ['addCurrentLocation'])
  }
}
</script>
