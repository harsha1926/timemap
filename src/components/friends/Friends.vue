<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row wrap class="ma-0 pa-0">
      <v-col
        v-for="friendId in friendIds"
        :key="friendId"
        class="ma-0 pa-0"
        cols="12"
        sm="6"
        md="4"
        la="2"
      >
        <friend
          :friendId="friendId"
          @friendRemoved="friendRemoved"
          :category="category"
        />
      </v-col>
      <v-snackbar
        v-model="showFriendRemovedSnackbar"
        :timeout="1000"
        color="primary"
      >
        {{ removedFriendName }} is not your friend anymore
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
      friendIds: [],
      categories: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    category() {
      return this.categories[Math.floor(Math.random() * this.categories.length)]
    }
  },
  mounted() {
    const vm = this
    vm.fetchFriendsList()
    vm.fetchRandomCategory()
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
    },
    fetchRandomCategory() {
      const vm = this
      firebaseDB.ref('categories').once('value', function(categories) {
        categories.forEach((category) => {
          if (category.key) vm.categories.push(category.key)
        })
      })
    }
  }
}
</script>
