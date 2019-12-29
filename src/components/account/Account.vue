<template>
  <v-container fluid style="max-width: 600px; height: 85vh; max-height: 85%;">
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-row>
          <input
            ref="imageUpdate"
            v-show="false"
            @change="updateImage"
            accept="image/*"
            type="file"
          />
          <v-img
            v-if="photoURL"
            @click="$router.push('/account/editPhoto')"
            :src="photoURL"
            :aspect-ratio="16 / 9"
            max-height="400"
            content
            class="align-center"
          >
            <v-row justify="center">
              <v-progress-circular
                v-if="loadingImage"
                color="white"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </v-img>
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
        <v-row align="center" class="pa-2">
          <v-btn to="/admin" color="primary">Admin Actions</v-btn>
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
import { auth, firebaseDB, firebaseStorage } from '@/services/firebaseInit.js'
export default {
  data: () => ({
    showEditDisplayNameDialog: false,
    admin: false,
    loadingImage: false
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
    ...mapActions('user', ['removeUser', 'addDisplayName', 'addPhotoURL']),
    updateImage(e) {
      const vm = this
      const storageRef = firebaseStorage.ref('users/' + vm.uid)
      const files = e.target.files
      if (files.length > 0) {
        vm.loadingImage = true
        storageRef.put(files[0]).then(() => {
          storageRef.getDownloadURL().then((url) => {
            firebaseDB
              .ref('users')
              .child(vm.uid)
              .update({
                photoURL: url
              })
            vm.addPhotoURL(url)
            vm.loadingImage = false
          })
        })
      }
    },
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
