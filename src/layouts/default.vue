<template>
  <v-app id="timemap">
    <v-app-bar app color="primary">
      <v-toolbar-title class="success--text">
        <v-btn fab icon color="success">
          <v-icon>fas fa-user-clock</v-icon>
        </v-btn>
      </v-toolbar-title>
      <span class="headline mt-1 success--text">TimeMap</span>
      <v-row @click="logout" justify="end">
        <v-btn fab icon color="success">
          <v-icon>fa-sign-out-alt</v-icon>
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt></nuxt>
      </v-container>
    </v-content>
    <v-footer height="20" class="ma-0 pa-0" color="primary" app>
      <v-row class="success--text caption ml-3" justify="center"
        >&copy; 2019</v-row
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({}),
  middleware: ['authCheck'],
  methods: {
    logout() {
      const vm = this
      vm.$store.commit('user/USER_UPDATED', null)
      vm.$router.push('/login')
    }
  }
}
</script>
