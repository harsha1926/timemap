<template>
  <v-row wrap justify="center" class="pa-2">
    <input
      ref="imageUpdate"
      v-show="false"
      @change="updateImage"
      accept="image/*"
      type="file"
    />
    <v-card max-width="400">
      <v-img
        v-if="photoURL"
        @click="$refs.imageUpdate.click()"
        :src="photoURL"
        height="300px"
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
      <v-card-subtitle>
        <v-row justify="space-between" align="center" class="pa-2 nameTitle">
          <span v-if="displayName">{{ displayName }}</span>
          <v-btn @click="openEditDisplayNameDialog" color="primary" fab icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="space-between" align="center" class="pa-2 nameTitle">
          <span v-if="phoneNumber">{{ phoneNumber }}</span>
          <v-btn color="primary" fab icon to="/account/updatePhone">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-row>
      </v-card-subtitle>
      <v-card-actions>
        <v-container>
          <v-row justify="space-between" align="center">
            <v-btn to="/schedule" color="primary">My Routine</v-btn>
            <v-menu offset-y left>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="primary" fab icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item :key="0" @click="logout">
                  <v-list-item-title>
                    <v-btn color="primary" text>Logout</v-btn>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item :key="1" v-if="admin">
                  <v-list-item-title>
                    <v-btn to="/admin" color="primary" text
                      >Admin Actions</v-btn
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showEditDisplayNameDialog" max-width="400" eager>
      <v-card>
        <v-card-text>
          <v-text-field
            ref="editName"
            @keydown.enter="showEditDisplayNameDialog = false"
            :value="displayName"
            @input="updateDisplayName"
            class="nameTitle"
            hide-details
            single-line
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
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
<style scoped>
.nameTitle {
  font-size: 16px;
  font-family: 'Lexend Mega', sans-serif;
  font-weight: 900;
}
</style>
