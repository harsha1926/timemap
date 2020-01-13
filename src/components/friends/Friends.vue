<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row wrap>
      <v-col
        v-for="friendId in friendIds"
        :key="friendId"
        :class="$vuetify.breakpoint.xsOnly ? 'mt-0 pt-0' : ''"
        cols="12"
        sm="6"
        md="4"
        la="2"
      >
        <friend :friendId="friendId" @friendRemoved="friendRemoved" />
      </v-col>
      <v-snackbar
        v-model="showFriendRemovedSnackbar"
        :timeout="1000"
        color="primary"
      >
        You are not watching {{ removedFriendName }} anymore
        <v-icon>far fa-frown</v-icon>
      </v-snackbar>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Friend from './Friend'
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  components: {
    Friend
  },
  data() {
    return {
      showFriendRemovedSnackbar: false,
      removedFriendName: '',
      friendIds: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted() {
    const vm = this
    vm.fetchFriendsList()
  },
  methods: {
    friendRemoved(removedFriend) {
      const index = this.friendIds.findIndex((o) => o === removedFriend.uid)
      if (index > -1) {
        this.friendIds.splice(index, 1)
        this.removedFriendName = removedFriend.displayName
        this.showFriendRemovedSnackbar = true
      }
    },
    fetchFriendsList() {
      const vm = this
      firebaseDB.ref('watching/' + vm.uid).once('value', function(friends) {
        vm.friendIds = []
        friends.forEach((friend) => {
          vm.friendIds.push(friend.val().uid)
        })
      })
    }
  }
}
</script>
