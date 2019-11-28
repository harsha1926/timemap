<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" xl="4">
      <v-row justify="center" align="center">
        <v-col cols="2">
          <v-row align="center" justify="start" class="ma-2">
            <v-avatar slot="icon">
              <v-img :src="friend.photoURL"></v-img>
            </v-avatar>
          </v-row>
        </v-col>

        <v-col cols="7">
          <v-row align="center" justify="center" class="ma-2">
            <span>{{ friend.displayName }}</span>
          </v-row>
        </v-col>

        <v-col cols="3">
          <v-row align="center" justify="end" class="ma-2">
            <v-btn
              v-if="!isFriendAlready"
              @click="addFriend"
              x-small
              fab
              icon
              color="primary"
            >
              <v-icon>fas fa-user-plus</v-icon>
            </v-btn>
            <v-icon v-else color="primary">far fa-smile</v-icon>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-snackbar v-model="friendAdded" :timeout="3000" color="primary">
      {{ friend.displayName }} is your friend now
      <v-icon>far fa-smile</v-icon>
    </v-snackbar>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    friend: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data: () => ({
    friendAdded: false
  }),
  computed: {
    ...mapGetters({
      user: 'user/user',
      friends: 'friends/friends'
    }),
    isFriendAlready() {
      return (
        this.friends && this.friends.find((o) => o.email === this.friend.email)
      )
    }
  },
  methods: {
    ...mapActions({
      addFriendAction: 'friends/addFriend'
    }),
    addFriend() {
      const vm = this
      firebase
        .database()
        .ref(
          'users/' +
            vm.encodeEmail(vm.user.email) +
            '/friends/' +
            vm.encodeEmail(vm.friend.email)
        )
        .set(true)
      vm.addFriendAction(vm.friend)
      vm.friendAdded = true
    }
  }
}
</script>
