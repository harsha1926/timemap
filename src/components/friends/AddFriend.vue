<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''">
    <v-skeleton-loader v-if="loading" type="list-item-avatar"></v-skeleton-loader>
    <v-row v-else-if="friend">
      <v-col cols="2">
        <v-avatar size="35">
          <v-img :src="friend.photoURL"></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="8">
        <v-flex class="subtitle-1 font-weight-medium">
          {{
          displayNameCaptilize
          }}
        </v-flex>
        <v-flex v-if="isFriendAlready" class="caption">You are watching..</v-flex>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-icon v-if="!isFriendAlready" @click="addFriend" color="primary">fas fa-eye</v-icon>
        <v-icon v-else @click="removeFriend" small color="tertiary">fas fa-eye-slash</v-icon>
      </v-col>
      <v-snackbar v-model="friendAdded" :timeout="1000" color="primary">
        You are watching {{ friend.displayName }} now
        <v-icon>far fa-smile</v-icon>
      </v-snackbar>
      <v-snackbar v-model="friendRemoved" :timeout="1000" color="primary">
        You are not watching {{ friend.displayName }} anymore
        <v-icon>far fa-frown</v-icon>
      </v-snackbar>
    </v-row>
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
    }
  },
  data() {
    return {
      isFriendAlready: false,
      friendAdded: false,
      friendRemoved: false,
      loading: false,
      friend: null
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
      const vm = this
      firebaseDB.ref('watching/' + vm.uid + '/' + vm.friend.uid).set(null)
      this.isFriendAlready = false
      this.friendRemoved = true
    }
  }
}
</script>
