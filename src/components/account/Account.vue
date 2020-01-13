<template>
  <v-container fluid style="max-width: 600px;">
    <v-row justify="center">
      <v-col cols="12">
        <v-row justify="center">
          <v-avatar v-show="photoURL" size="200" class="customPointer" tile>
            <v-img
              v-if="photoURL"
              @click="$router.push('/account/editPhoto')"
              :src="photoURL"
              content
            ></v-img>
          </v-avatar>
        </v-row>
        <v-row justify="space-between" align="center" class="pa-2">
          <span v-if="displayName">{{ displayName }}</span>
          <v-btn @click="openEditDisplayNameDialog" color="primary" fab icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="space-between" align="center" class="pa-2">
          <span v-if="phoneNumber">{{ phoneNumber }}</span>
          <v-btn color="primary" fab icon to="/account/updatePhone">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-row>
        <v-row align="center" class="pa-2">
          <v-btn @click="logout" color="primary">Logout</v-btn>
        </v-row>
        <v-dialog v-model="showEditDisplayNameDialog" max-width="400" eager>
          <v-card>
            <v-card-text>
              <v-text-field
                ref="editName"
                @keydown.enter="showEditDisplayNameDialog = false"
                :value="displayName"
                @input="updateDisplayName"
                hide-details
                single-line
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { auth, firebaseDB } from '@/services/firebaseInit.js'
export default {
  data: () => ({
    showEditDisplayNameDialog: false
  }),
  computed: {
    ...mapGetters('user', ['uid', 'displayName', 'photoURL', 'phoneNumber'])
  },
  mounted() {
    const vm = this
    firebaseDB.ref('admins/' + vm.uid).once('value', function(snapshot) {
      if (snapshot.val()) {
        vm.admin = true
      }
    })
  },
  methods: {
    ...mapActions('user', ['removeUser', 'addDisplayName']),
    openEditDisplayNameDialog() {
      this.showEditDisplayNameDialog = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.editName.focus()
        }, 10)
      })
    },
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
    },
    updateDisplayName(value) {
      firebaseDB
        .ref('users')
        .child(this.uid)
        .update({ displayName: value, nameLowerCase: value.toLowerCase() })
      this.addDisplayName(value)
    }
  }
}
</script>
