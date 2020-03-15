<template>
  <v-container fluid fill-height style="height: 85vh; max-height: 85%;">
    <v-row align="start" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-text>
            <p>Hi there,</p>
            <p>Thanks for showing your interest!</p>
            <p>
              Philosophy behind our application is to look back how we have been
              today with our friends by getting their ratings anonymously. And
              then erase them all everyday, to start fresh again.
            </p>
            <p class="title">It's okay to, Just Restart!</p>
            <p>
              We hope our fun filled app can help you know more about your loved
              ones.
            </p>
            <p>Please login,</p>
            <p class="overline">
              By using our app, you are accepting the practices described in
              this
              <a @click="showPrivacyPolicy = true">Privacy Policy</a>
            </p>
          </v-card-text>
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
    <v-dialog v-model="showPrivacyPolicy">
      <privacy-policy
        :isDialog="true"
        @dialog-closed="showPrivacyPolicy = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import {
  auth,
  GoogleProvider,
  FacebookProvider,
  loginProviders
} from '@/services/firebaseInit.js'
import PrivacyPolicy from '~/components/privacyPolicy/PrivacyPolicy'
export default {
  components: {
    PrivacyPolicy
  },
  data: () => ({
    loginError: null,
    showPrivacyPolicy: false,
    acceptPrivacyPolicy: true
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
