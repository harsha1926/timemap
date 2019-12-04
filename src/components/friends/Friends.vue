<template>
  <v-row wrap>
    <v-flex
      v-for="friendId in friendIds"
      :key="friendId"
      xs12
      sm8
      md4
      la2
      xl2
      class="pa-1 mt-1"
    >
      <friend :friendId="friendId" @friendRemoved="friendRemoved" />
    </v-flex>
    <v-snackbar
      v-model="showFriendRemovedSnackbar"
      :timeout="3000"
      color="primary"
    >
      {{ removedFriendName }} is not your friend anymore
      <v-icon>far fa-frown</v-icon>
    </v-snackbar>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import Friend from './Friend'
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
    ...mapGetters({
      user: 'user/user'
    })
  },
  mounted() {
    this.fetchFriendsList()
  },
  methods: {
    friendRemoved(removedFriend) {
      this.removedFriendName = removedFriend.displayName
      this.showFriendRemovedSnackbar = true
    },
    fetchFriendsList() {
      const vm = this
      firebase
        .database()
        .ref('friends/' + vm.user.uid)
        .once('value', function(friends) {
          vm.friendIds = []
          friends.forEach((friend) => {
            vm.friendIds.push(friend.key)
          })
        })
    }
  }
}
</script>
