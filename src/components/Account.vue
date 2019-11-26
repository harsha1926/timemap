<template>
  <v-row v-if="user" wrap justify="center" class="pa-2">
    <v-card max-width="400">
      <v-img
        v-if="user.photoURL"
        :src="user.photoURL"
        height="350px"
        content
        class="align-end"
      >
        <v-card-title>
          <v-row align="end" justify="end">
            <v-btn fab icon color="primary">
              <v-icon>fas fa-pen</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
      </v-img>
      <v-card-subtitle>
        <v-row justify="space-between" align="center" class="pa-2 nameTitle">
          <span>{{ user.displayName }}</span>
          <v-btn fab icon color="primary">
            <v-icon>fas fa-pen</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="space-between" align="center" class="pa-2">
          <span>{{ user.dailyUpdate }}</span>
          <v-btn fab icon color="primary">
            <v-icon>fas fa-pen</v-icon>
          </v-btn>
        </v-row>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn color="orange" text>Switch Account</v-btn>
        <v-btn @click="logout" color="orange" text>Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
export default {
  data: () => ({}),
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    logout() {
      const vm = this
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          vm.$router.push('/login')
        })
        .catch(function(e) {
          /* eslint-disable no-console */
          console.error(e)
        })
    },
    switchAccount() {
      // TODO
    }
  }
}
</script>
<style scoped>
.nameTitle {
  font-size: 16px;
  font-family: 'Lexend Mega', sans-serif;
  font-weight: 900;
}
</style>
