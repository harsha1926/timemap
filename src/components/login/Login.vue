<template>
  <v-container fluid fill-height style="height: 85vh; max-height: 85%;">
    <v-row align="start" justify="center">
      <v-col cols="12" sm="8" md="4" class="text-center">
        <v-card class="elevation-12">
          <v-card-title class="body-1">
            Hi there,
            <br />Thanks for showing your interest! <br />We hope our fun filled
            app can help you know more about your loved ones. <br />Please
            login,
          </v-card-title>
          <v-card-actions class="col justify-center">
            <v-btn
              @click="googleSignIn"
              name="googleLoginBtn"
              fab
              icon
              color="primary"
            >
              <v-icon>fab fa-google</v-icon>
            </v-btn>
            <v-btn
              @click="facebookSignIn"
              name="facebookLoginBtn"
              fab
              icon
              color="primary"
            >
              <v-icon>fab fa-facebook-f</v-icon>
            </v-btn>
            <v-row
              v-if="loginError"
              class="overline ma-2 pa-2 error--text"
              wrap
              >{{ loginError }}</v-row
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  auth,
  GoogleProvider,
  FacebookProvider,
  loginProviders
} from '@/services/firebaseInit.js'
export default {
  data: () => ({
    loginError: null
  }),
  beforeCreate() {
    const vm = this
    auth.getRedirectResult().then(
      (result) => {
        const user = result.user
        if (user) {
          vm.addUser(user)
        }
      },
      (error) => {
        // eslint-disable-next-line
        console.error(error)
        const email = error.email
        if (error.code === 'auth/account-exists-with-different-credential') {
          auth.fetchSignInMethodsForEmail(email).then((providers) => {
            if (providers && providers.length) {
              const linkedProvider = loginProviders.find(
                (o) => o.providerId === providers[0]
              )
              auth
                .signInWithPopup(
                  linkedProvider.setCustomParameters({ login_hint: email })
                )
                .then(
                  (result) => {
                    const user = result.user
                    user.linkWithCredential(error.credential)
                    vm.addUserToStore(user)
                  },
                  (err) => {
                    vm.loginError = err.message
                  }
                )
            } else {
              vm.loginError = error.message
            }
          })
        } else {
          vm.loginError = error.message
        }
      }
    )
  },
  methods: {
    googleSignIn() {
      this.$store.commit('app/LOGIN_ERROR_UPDATED', null)
      auth.signInWithRedirect(GoogleProvider)
    },
    facebookSignIn() {
      this.$store.commit('app/LOGIN_ERROR_UPDATED', null)
      auth.signInWithRedirect(FacebookProvider)
    }
  }
}
</script>
