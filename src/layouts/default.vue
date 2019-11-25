<template>
  <v-app id="timeMap">
    <v-app-bar app color="#ffffff">
      <v-avatar tile size="30">
        <v-img src="/icon.png"></v-img>
      </v-avatar>
      <span class="appTitle primary--text">TIMEMAP</span>
      <v-row justify="end" align="center">
        <v-btn small fab icon color="primary" class="mr-5">
          <v-icon>fas fa-search</v-icon>
        </v-btn>
        <span
          v-if="user && user.displayName"
          class="appGreeting mr-5 d-none d-sm-block"
          >Hello {{ user.displayName }}</span
        >
        <v-btn fab icon to="/account">
          <v-avatar v-if="user && user.photoURL" class size="40">
            <v-img :src="user.photoURL"></v-img>
          </v-avatar>
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt></nuxt>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    on: false
  }),
  middleware: ['authCheck'],
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
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
</style>
