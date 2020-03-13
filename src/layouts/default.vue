<template>
  <v-app id="watch">
    <v-app-bar
      :dense="$vuetify.breakpoint.xsOnly"
      color="#ffffff"
      app
      tile
      flat
    >
      <span
        v-if="!showSearchBar"
        @click="$router.push('/')"
        class="customPointer text-left appTitleFont primary--text"
        >Just Restart</span
      >
      <v-spacer v-if="!showSearchBar" />
      <v-avatar
        v-if="!showSearchBar"
        @click="showSearchBarFocus()"
        class="customPointer mr-2"
        size="35"
      >
        <v-icon color="grey">fas fa-search</v-icon>
      </v-avatar>
      <span v-if="displayName && !showSearchBar" class="mr-5 d-none d-sm-block"
        >Hello {{ displayName }}</span
      >
      <v-avatar
        @click="$router.push('/account')"
        v-if="photoURL && !showSearchBar"
        class="customPointer"
        size="35"
      >
        <v-img :src="photoURL"></v-img>
      </v-avatar>

      <v-text-field
        ref="searchInput"
        v-model="searchVal"
        v-show="showSearchBar"
        eager
        hide-details
      ></v-text-field>
      <v-avatar
        v-if="showSearchBar"
        @click="showSearchBar = false"
        class="customPointer"
        size="35"
      >
        <v-icon color="grey">fas fa-times</v-icon>
      </v-avatar>
    </v-app-bar>

    <v-content>
      <v-container fluid class="mt-0 pt-0">
        <v-row>
          <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
        </v-row>

        <v-row v-if="loading">
          <v-progress-linear color="primary" indeterminate></v-progress-linear>
        </v-row>

        <login v-else-if="!uid"></login>
        <verify-phone v-else-if="uid && !phoneNumber"></verify-phone>
        <nuxt v-else-if="uid && phoneNumber"></nuxt>
      </v-container>
    </v-content>

    <v-footer color="white" app class="ma-0 pa-0">
      <v-container fluid class="fill-height pa-0 ma-0">
        <v-row class="ma-0 pa-0">
          <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
        </v-row>
        <v-row row align="center" justify="space-between" class="mt-1 mb-1">
          <v-flex @click="$router.push('/')" class="customPointer text-center">
            <v-icon v-if="currentPage && currentPage === '/'" color="primary"
              >fas fa-eye</v-icon
            >
            <v-icon v-else color="grey">far fa-eye</v-icon>
          </v-flex>

          <v-flex
            @click="$router.push('/findFriends')"
            class="customPointer text-center"
          >
            <v-icon
              v-if="currentPage && currentPage.startsWith('/findFriends')"
              color="primary"
              >fas fa-user-plus</v-icon
            >
            <v-icon v-else color="grey">fas fa-user-plus</v-icon>
          </v-flex>

          <v-flex
            @click="$router.push('/schedule')"
            class="customPointer text-center"
          >
            <v-icon
              v-if="currentPage && currentPage.startsWith('/schedule')"
              color="primary"
              >fas fa-calendar-check</v-icon
            >
            <v-icon v-else color="grey">far fa-calendar-check</v-icon>
          </v-flex>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import Login from '~/components/login/Login'
import VerifyPhone from '~/components/login/VerifyPhone'
import { auth } from '@/services/firebaseInit.js'

export default {
  components: {
    Login,
    VerifyPhone
  },
  data: () => ({
    loading: true,
    on: false,
    showSearchBar: false
  }),
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL', 'phoneNumber']),
    ...mapGetters('app', ['search']),
    currentPage() {
      return this.$route.path
    },
    searchVal: {
      get() {
        return this.search
      },
      set(newVal) {
        this.$store.commit('app/SEARCH_UPDATED', newVal)
      }
    }
  },
  mounted() {
    const vm = this
    auth.onAuthStateChanged((user) => {
      if (user) {
        vm.addUser(user)
      }

      setTimeout(() => {
        vm.loading = false
      }, 1000)
    })
  },
  methods: {
    showSearchBarFocus() {
      const vm = this
      vm.showSearchBar = true
      vm.$nextTick(() => {
        vm.$refs.searchInput.focus()
      })
    }
  }
}
</script>
