<template>
  <v-app id="timeMapNoNav">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="start" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title>
                <v-row class="appTitle primary--text" justify="center"
                  >TIMEMAP</v-row
                >
              </v-card-title>
              <v-card-subtitle class="mt-5">
                <v-row class="appLoginHeading" justify="center"
                  >Hi, there.</v-row
                >
                <v-row class="appLoginInfo ma-5" justify="center">
                  Thanks for showing your interest in Timemap. We hope our fun
                  filled cute app can help you know more about your loved ones.
                  Please login,
                </v-row>
              </v-card-subtitle>
              <v-card-text>
                <v-row justify="center">
                  <v-btn @click="googleSignIn" fab icon color="primary">
                    <v-icon>fab fa-google</v-icon>
                  </v-btn>
                  <v-btn @click="facebookSignIn" fab icon color="primary">
                    <v-icon>fab fa-facebook-f</v-icon>
                  </v-btn>
                  <v-btn @click="phoneSignIn" fab icon color="primary">
                    <v-icon>fas fa-phone</v-icon>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
export default {
  data: () => ({}),
  layout: 'noNav',
  mounted() {
    const vm = this
    vm.$nextTick(() => {
      vm.$nuxt.$loading.start()
      firebase
        .auth()
        .getRedirectResult()
        .then(function(result) {
          vm.$router.push('/')
          vm.$nuxt.$loading.finish()
        })
        .catch(function(error) {
          if (
            error.email &&
            error.credential &&
            error.code === 'auth/account-exists-with-different-credential'
          ) {
            firebase
              .auth()
              .signInWithPopup(
                new firebase.auth.GoogleAuthProvider().setCustomParameters({
                  login_hint: error.email
                })
              )
              .then((result) => {
                result.user.linkWithCredential(error.credential)
              })
          }
        })
    })
  },
  methods: {
    googleSignIn() {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    },
    facebookSignIn() {
      firebase
        .auth()
        .signInWithRedirect(new firebase.auth.FacebookAuthProvider())
    },
    phoneSignIn() {
      this.$router.push('/login/phone')
    }
  }
}
</script>
<style scoped>
.appTitle {
  font-size: 40px;
  font-family: 'Turret Road', cursive;
  font-weight: 900;
}
.appLoginHeading {
  font-size: 20px;
  font-family: 'Lexend Mega', sans-serif;
}
.appLoginInfo {
  font-family: 'Lexend Mega', sans-serif;
}
</style>
