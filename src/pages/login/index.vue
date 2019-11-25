<template>
  <v-app id="timeMapNoNav">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="start" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title>
                <v-row
                  class="appTitle primary--text"
                  align="center"
                  justify="center"
                >
                  <v-avatar tile>
                    <v-img src="/icon.png"></v-img>
                  </v-avatar>
                  <span class="ml-3">TIMEMAP</span>
                </v-row>
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
        <v-row>
          <v-dialog v-model="accountAlreadyExistsError" max-width="400">
            <v-card>
              <v-card-text class="primary--text pa-5 sameEmailError">
                <v-row align="center" justify="center" class="pa-2 ma-2">
                  Sorry
                  <v-icon class="ml-3" color="primary">far fa-frown</v-icon>
                </v-row>
                <v-row class="pa-2 ma-2" align="center" justify="center"
                  >Account using same email address already exists!</v-row
                >
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
export default {
  data: () => ({
    accountAlreadyExistsError: false
  }),
  layout: 'noNav',
  mounted() {
    const vm = this
    vm.$nextTick(() => {
      vm.$nuxt.$loading.start()
      firebase
        .auth()
        .getRedirectResult()
        .then(function(result) {
          const user = result.user
          const ref = firebase.database().ref('users')
          ref.push().set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber
          })
          vm.$router.push('/')
          vm.$nuxt.$loading.finish()
        })
        .catch(function(error) {
          if (error.code === 'auth/account-exists-with-different-credential') {
            vm.$nuxt.$loading.finish()
            vm.accountAlreadyExistsError = true
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
.sameEmailError {
  font-size: 16px;
  font-family: 'Lexend Mega', sans-serif;
}
</style>
