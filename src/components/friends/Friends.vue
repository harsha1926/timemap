<template>
  <v-row wrap>
    <v-flex
      v-for="friend in friends"
      :key="friend.email"
      xs12
      sm8
      md4
      la2
      xl2
      class="pa-1 mt-1"
    >
      <friend :friend="friend" @friendRemoved="friendRemoved" />
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
import { mapGetters, mapActions } from 'vuex'
import Friend from './Friend'
export default {
  components: {
    Friend
  },
  data() {
    return {
      showFriendRemovedSnackbar: false,
      removedFriendName: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      friends: 'friends/friends'
    })
  },
  mounted() {
    const vm = this
    vm.clearFriendsList()
    if (vm.user) {
      firebase
        .database()
        .ref('users/' + vm.encodeEmail(vm.user.email) + '/friends')
        .once('value', function(friendsList) {
          friendsList.forEach(function(data) {
            firebase
              .database()
              .ref('users/' + data.key)
              .on('value', function(data) {
                if (data && data.val()) vm.addFriendAction(data.val())
              })
          })
        })
    }
  },
  methods: {
    ...mapActions({
      addFriendAction: 'friends/addFriend',
      clearFriendsList: 'friends/clearFriendsList'
    }),
    friendRemoved(removedFriend) {
      this.removedFriendName = removedFriend.displayName
      this.showFriendRemovedSnackbar = true
    }
  }
}
</script>
