<template>
  <v-container
    :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''"
    fluid
    fill-height
    style="height: 85vh; max-height: 85%;"
  >
    <v-row align="start" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-subtitle class="mt-5">
            <v-row justify="center" class="title">Hi, there.</v-row>
            <v-row class="ma-5 subtitle-1" justify="center">
              Thanks for showing your interest. We hope our fun
              filled app can help you know more about your loved ones. Please
              login,
            </v-row>
          </v-card-subtitle>
          <v-card-text>
            <v-row justify="center">
              <v-btn @click="googleSignIn" name="googleLoginBtn" fab icon color="primary">
                <v-icon>fab fa-google</v-icon>
              </v-btn>
              <v-btn @click="facebookSignIn" name="facebookLoginBtn" fab icon color="primary">
                <v-icon>fab fa-facebook-f</v-icon>
              </v-btn>
            </v-row>
            <v-row v-if="loginError" class="overline ma-2 pa-2 error--text" wrap>{{ loginError }}</v-row>
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
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('app', ['loginError'])
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
