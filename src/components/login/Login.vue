<template>
  <v-container fluid fill-height style="height: 85vh; max-height: 85%;">
    <v-row align="start" justify="center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
      <v-col v-else cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-subtitle class="mt-5">
            <v-row class="appLoginHeading" justify="center">Hi, there.</v-row>
            <v-row class="appLoginInfo ma-5" justify="center">
              Thanks for showing your interest in Timemap. We hope our fun
              filled app can help you know more about your loved ones.
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
            </v-row>
            <v-row
              v-if="errorMessage"
              class="overline ma-2 pa-2 error--text"
              wrap
            >{{ errorMessage }}</v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  auth,
  GoogleProvider,
  FacebookProvider
} from '@/services/firebaseInit.js'
export default {
  data: () => ({
    loading: false,
    errorMessage: null
  }),
  methods: {
    googleSignIn() {
      const vm = this
      vm.loading = true
      auth
        .signInWithRedirect(GoogleProvider)
        .catch((error) => {
          vm.errorMessage = error.message
        })
        .finally(() => {
          vm.loading = false
        })
    },
    facebookSignIn() {
      const vm = this
      vm.loading = true
      auth
        .signInWithRedirect(FacebookProvider)
        .catch((error) => {
          vm.errorMessage = error.message
        })
        .finally(() => {
          vm.loading = false
        })
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
