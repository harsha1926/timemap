<template>
  <v-container fluid fill-height style="height: 85vh; max-height: 85%;">
    <v-row align="start" justify="center">
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-col v-else cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-subtitle class="mt-5">
            <v-row class="appLoginHeading" justify="center">Hi, there.</v-row>
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
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
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
</template>

<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    accountAlreadyExistsError: false,
    loading: false
  }),
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  mounted() {
    const vm = this
    vm.loading = true
    vm.$nextTick(() => {
      firebase
        .auth()
        .getRedirectResult()
        .then(function(result) {
          if (result && result.user) {
            const user = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              phoneNumber: result.user.phoneNumber
            }

            firebase
              .database()
              .ref('users')
              .child(user.uid)
              .set(user)
            vm.addUser(user)
            vm.$router.push('/')
            vm.loading = false
          } else {
            vm.loading = false
          }
        })
        .catch(function(error) {
          if (error.code === 'auth/account-exists-with-different-credential') {
            vm.accountAlreadyExistsError = true
          }
          vm.loading = false
        })
    })
  },
  methods: {
    ...mapActions({
      addUser: 'user/addUser'
    }),
    googleSignIn() {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    },
    facebookSignIn() {
      firebase
        .auth()
        .signInWithRedirect(new firebase.auth.FacebookAuthProvider())
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
