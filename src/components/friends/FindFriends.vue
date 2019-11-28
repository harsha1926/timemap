<template>
  <div>
    <v-row align="center" justify="center" class="pa-2">
      <v-col cols="12" sm="6" xl="4">
        <v-row align="center" justify="center">
          <v-text-field
            v-model="search"
            outlined
            label="Find by name, email address or phone number"
          ></v-text-field>
        </v-row>
      </v-col>
    </v-row>
    <add-friend
      v-for="friend in tobeFriendsFiltered"
      :key="friend.email"
      :friend="friend"
    />
  </div>
</template>
<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import AddFriend from './AddFriend'
export default {
  components: {
    AddFriend
  },
  data() {
    return {
      tobeFriends: [],
      search: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    tobeFriendsFiltered() {
      return this.search
        ? this.tobeFriends.filter(
            (o) =>
              this.searchFriendByDisplayName(o, this.search) ||
              this.searchFriendByEmail(o, this.search)
          )
        : this.tobeFriends
    }
  },
  mounted() {
    const vm = this
    firebase
      .database()
      .ref('users')
      .on('child_added', function(data) {
        if (data.key !== vm.encodeEmail(vm.user.email)) {
          vm.tobeFriends.push(data.val())
        }
      })
  },
  methods: {
    searchFriendByDisplayName(friend, search) {
      return (
        search &&
        friend &&
        friend.displayName &&
        friend.displayName.toUpperCase().includes(search.toUpperCase())
      )
    },
    searchFriendByEmail(friend, search) {
      return (
        search &&
        friend &&
        friend.email &&
        friend.email.toUpperCase().includes(search.toUpperCase())
      )
    }
  }
}
</script>
