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
        <v-row justify="space-between" align="center" class="pa-2">
          <v-flex>Linked accounts</v-flex>
          <v-flex>
            <v-row justify="end" class="mr-2">
              <v-col
                v-for="provider in loginProvidersList"
                :key="provider.icon"
                class="mr-2"
                cols="2"
              >
                <v-icon v-if="provider.activated">{{ provider.icon }}</v-icon>
              </v-col>
            </v-row>
          </v-flex>
        </v-row>
        <v-row align="center" class="pa-2">
          <v-btn @click="logout" color="primary">Logout</v-btn>
        </v-row>
        <v-row v-if="admin" align="center" class="pa-2">
          <v-btn to="/admin/gifs" color="primary">Manage GIFs</v-btn>
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
import { auth, firebaseDB, loginProviders } from '@/services/firebaseInit.js'
export default {
  data: () => ({
    admin: false,
    showEditDisplayNameDialog: false,
    loginProvidersList: []
  }),
  computed: {
    ...mapGetters('user', [
      'uid',
      'email',
      'displayName',
      'photoURL',
      'phoneNumber'
    ])
  },
  mounted() {
    const vm = this
    firebaseDB.ref('admins/' + vm.uid).once('value', function(snapshot) {
      if (snapshot.val()) {
        vm.admin = true
      }
    })
    this.loginProvidersList = loginProviders
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
      auth.signOut().then(function() {
        vm.removeUser()
        vm.$router.push('/')
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
