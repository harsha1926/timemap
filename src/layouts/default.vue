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
        <v-avatar v-if="user && user.photoURL" class size="40">
          <v-img :src="user.photoURL"></v-img>
        </v-avatar>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" fab icon small color="primary">
              <v-icon small>fas fa-ellipsis-v</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item key="1" @click="showAccount">
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
            <v-list-item key="2" @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
import firebase from 'firebase'
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
  },
  methods: {
    logout() {
      const vm = this
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          vm.$router.push('/login')
        })
        .catch(function(e) {
          /* eslint-disable no-console */
          console.error(e)
        })
    },
    showAccount() {
      // TODO
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
</style>
