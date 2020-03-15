<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''">
    <v-skeleton-loader
      v-if="loading"
      type="list-item-avatar"
    ></v-skeleton-loader>
    <v-row v-else-if="friend">
      <v-col cols="2">
        <v-avatar size="35">
          <v-img :src="friend.photoURL"></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="8">
        <v-flex class="subtitle-1 font-weight-medium">
          {{ displayNameCaptilize }}
        </v-flex>
        <v-flex v-if="isFriendAlready" class="caption"
          >You are watching..</v-flex
        >
      </v-col>
      <v-col cols="2" class="text-center">
        <v-icon
          v-if="!isFriendAlready && !showRemove"
          @click="addFriend"
          color="primary"
          >fas fa-eye</v-icon
        >
        <v-icon
          v-else-if="!showRemove"
          @click="showWarning = true"
          small
          color="tertiary"
          >fas fa-eye-slash</v-icon
        >
        <v-icon
          v-if="showRemove"
          @click="showRemoveWarning = true"
          color="error"
          >mdi-close</v-icon
        >
      </v-col>
    </v-row>
    <v-dialog v-model="showWarning" max-width="600">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-actions>
          <v-btn @click="removeFriend">Yes</v-btn>
          <v-btn @click="showWarning = false" color="primary">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="friend" v-model="showRemoveWarning" max-width="600">
      <v-card>
        <v-card-title class="body-2"
          >Are you sure? Do you want to stop {{ friend.displayName }} from
          watching you?</v-card-title
        >
        <v-card-actions>
          <v-btn @click="removeWatcher">Yes</v-btn>
          <v-btn @click="showRemoveWarning = false" color="primary">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-if="friend"
      v-model="friendAdded"
      :timeout="1000"
      color="primary"
    >
      You are watching {{ friend.displayName }} now
      <v-icon>far fa-smile</v-icon>
    </v-snackbar>
    <v-snackbar
      v-if="friend"
      v-model="friendRemoved"
      :timeout="1000"
      color="primary"
    >
      You are not watching {{ friend.displayName }} anymore
      <v-icon>far fa-frown</v-icon>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  props: {
    friendId: {
      type: String,
      default() {
        return null
      }
    },
    showRemove: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      isFriendAlready: false,
      friendAdded: false,
      friendRemoved: false,
      loading: false,
      friend: null,
      showWarning: false,
      showRemoveWarning: false
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    displayNameCaptilize() {
      if (!this.friend || (this.friend && !this.friend.displayName)) return ''
      return this.friend.displayName
        .split(' ')
        .map((o) => this.capitalizeFirstLetter(o))
        .join(' ')
    }
  },
  mounted() {
    if (this.friendId) {
      const vm = this
      vm.loading = true
      firebaseDB
        .ref('users/' + vm.friendId)
        .once('value', function(data) {
          vm.friend = data.val()
        })
        .finally(() => {
          vm.loading = false
        })

      firebaseDB
        .ref('watching/' + vm.uid + '/' + vm.friendId)
        .once('value', function(data) {
          if (data.val()) vm.isFriendAlready = true
        })
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    addFriend() {
      const vm = this
      firebaseDB
        .ref('watching/' + vm.uid + '/' + vm.friend.uid)
        .set({ uid: vm.friend.uid, isFavourite: false })
      this.isFriendAlready = true
      this.friendAdded = true
    },
    removeFriend() {
      firebaseDB.ref('watching/' + this.uid + '/' + this.friend.uid).set(null)
      this.isFriendAlready = false
      this.friendRemoved = true
      this.showWarning = false
    },
    removeWatcher() {
      firebaseDB.ref('watching/' + this.friend.uid + '/' + this.uid).set(null)
      this.$emit('watcher-removed', this.friend)
      this.showRemoveWarning = false
    }
  }
}
</script>
