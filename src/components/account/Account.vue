<template>
  <v-row wrap justify="center" class="pa-2">
    <v-card max-width="400">
      <v-img
        v-if="photoURL"
        :src="photoURL"
        height="300px"
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
          <span v-if="displayName">{{ displayName }}</span>
          <v-btn fab icon color="primary">
            <v-icon>fas fa-pen</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="space-between" align="center" class="pa-2 nameTitle">
          <span v-if="callingCode && phoneNumber"
            >+ {{ callingCode }} {{ phoneNumber }}</span
          >
          <v-btn fab icon color="primary">
            <v-icon>fas fa-pen</v-icon>
          </v-btn>
        </v-row>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn color="primary" text>Update your schedule</v-btn>
        <v-btn @click="logout" color="primary" text>Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({}),
  computed: {
    ...mapGetters('user', ['displayName', 'photoURL']),
    ...mapGetters('user/phone', ['callingCode', 'phoneNumber'])
  },
  methods: {
    ...mapActions('user', ['removeUser']),
    logout() {
      const vm = this
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          vm.removeUser()
          vm.$router.push('/')
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
