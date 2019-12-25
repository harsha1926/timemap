<template>
  <v-row wrap>
    <v-flex v-for="friendId in friendIds" :key="friendId" xs12 sm6 md4 la3 xl2>
      <friend :friendId="friendId" @friendRemoved="friendRemoved" />
    </v-flex>
    <v-snackbar v-model="showFriendRemovedSnackbar" :timeout="1000" color="primary">
      {{ removedFriendName }} is not your friend anymore
      <v-icon>far fa-frown</v-icon>
    </v-snackbar>
  </v-row>
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
      firebaseDB.ref('friends/' + vm.uid).once('value', function(friends) {
        vm.friendIds = []
        friends.forEach((friend) => {
          vm.friendIds.push(friend.key)
        })
      })
    }
  }
}
</script>
