<template>
  <v-app id="timeMap">
    <v-app-bar app color="#ffffff" height="40">
      <span class="appTitle primary--text">TIMEMAP</span>
      <v-row justify="end">
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
export default {
  data: () => ({
    on: false
  }),
  middleware: ['authCheck'],
  methods: {
    logout() {
      const vm = this
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          vm.$store.commit('user/USER_UPDATED', null)
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
  font-family: 'Turret Road', cursive;
  font-weight: 900;
}
</style>
