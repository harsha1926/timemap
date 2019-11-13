<template>
  <v-app id="stockNoNav">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title>
                Please login to use the application
              </v-card-title>
              <v-card-text>
                <v-btn @click="googleSignIn" fab icon color="primary">
                  <v-icon>fab fa-google</v-icon>
                </v-btn>
                <v-btn @click="googleSignIn" fab icon color="primary">
                  <v-icon>fab fa-facebook-f</v-icon>
                </v-btn>
                <v-btn @click="googleSignIn" fab icon color="primary">
                  <v-icon>fab fa-twitter</v-icon>
                </v-btn>
                <v-btn @click="googleSignIn" fab icon color="primary">
                  <v-icon>fab fa-whatsapp</v-icon>
                </v-btn>
                <v-btn @click="googleSignIn" fab icon color="primary">
                  <v-icon>fab fa-linkedin-in</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  layout: 'noNav',
  methods: {
    googleSignIn() {
      const vm = this
      vm.$store.commit('user/USER_UPDATED', { name: 'dummy' })
      vm.$router.push('/')
    }
  }
}
</script>
