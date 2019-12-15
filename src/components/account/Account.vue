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
          <v-row class="ma-1 pa-1 white--text" align="start" justify="start">
            <span v-if="displayName">{{ displayName }}</span>
          </v-row>
        </v-card-title>
      </v-img>
      <v-card-subtitle>
        <v-row justify="space-between" align="center" class="pa-2 nameTitle">
          <span v-if="phoneNumber">{{ phoneNumber }}</span>
        </v-row>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn color="primary" text>Update your schedule</v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { auth } from '@/services/firebaseInit.js'
export default {
  computed: {
    ...mapGetters('user', ['displayName', 'photoURL', 'phoneNumber'])
  },
  methods: {
    ...mapActions('user', ['removeUser']),
    logout() {
      const vm = this
      auth
        .signOut()
        .then(function() {
          vm.removeUser()
          vm.$router.push('/')
        })
        .catch(function(e) {
          console.error(e)
        })
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
