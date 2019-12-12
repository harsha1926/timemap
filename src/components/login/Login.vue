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
import { mapActions } from 'vuex'
export default {
  data: () => ({
    accountAlreadyExistsError: false,
    loading: false,
    supportedSignInMethods: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  }),
  mounted() {
    const vm = this
    vm.loading = true
    vm.$nextTick(() => {
      firebase
        .auth()
        .getRedirectResult()
        .then(function(result) {
          if (result && result.user) {
            firebase
              .database()
              .ref('users/' + result.user.uid)
              .once('value', function(data) {
                if (data.val()) {
                  firebase
                    .database()
                    .ref('users')
                    .child(result.user.uid)
                    .update({
                      displayName: result.user.displayName,
                      photoURL: result.user.photoURL
                    })
                  vm.addUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                  })
                  vm.addPhone(data.val().phone)
                } else {
                  firebase
                    .database()
                    .ref('users')
                    .child(result.user.uid)
                    .set({
                      uid: result.user.uid,
                      email: result.user.email,
                      displayName: result.user.displayName,
                      photoURL: result.user.photoURL
                    })
                  vm.addUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                  })
                }
              })
            vm.loading = false
          } else {
            vm.loading = false
          }
        })
        .catch(function(error) {
          if (
            error.email &&
            error.credential &&
            error.code === 'auth/account-exists-with-different-credential'
          ) {
            firebase
              .auth()
              .fetchSignInMethodsForEmail(error.email)
              .then((providers) => {
                const providerFound = providers.find((p) =>
                  vm.supportedSignInMethods.includes(p)
                )
                const linkedProvider = vm.getProvider(providerFound)
                firebase
                  .auth()
                  .signInWithPopup(
                    linkedProvider.setCustomParameters({
                      login_hint: error.email
                    })
                  )
                  .then((result) => {
                    result.user.linkWithCredential(error.credential)
                    vm.addUser({
                      uid: result.user.uid,
                      email: result.user.email,
                      displayName: result.user.displayName,
                      photoURL: result.user.photoURL
                    })
                    vm.loading = false
                  })
              })
          } else {
            vm.loading = false
          }
        })
    })
  },
  methods: {
    ...mapActions('user', ['addUser']),
    getProvider(providerId) {
      switch (providerId) {
        case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
          return new firebase.auth.GoogleAuthProvider()
        case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
          return new firebase.auth.FacebookAuthProvider()
        default:
          throw new Error(`No provider implemented for ${providerId}`)
      }
    },
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
