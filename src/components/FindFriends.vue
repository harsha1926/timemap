<template>
  <div>
    <v-row align="center" justify="center" class="pa-2">
      <v-col cols="12" sm="6" xl="4">
        <v-row align="center" justify="center">
          <v-text-field
            v-model="search"
            outlined
            label="Find by name/email/phone"
          ></v-text-field>
        </v-row>
      </v-col>
    </v-row>
    <friend
      v-for="friend in filteredFriends"
      :key="friend.email"
      :friend="friend"
    />
  </div>
</template>
<script>
import firebase from 'firebase'
import Friend from './Friend'
export default {
  components: {
    Friend
  },
  data() {
    return {
      friends: [],
      search: null
    }
  },
  computed: {
    filteredFriends() {
      return this.search
        ? this.friends.filter(
            (o) =>
              this.searchFriendByDisplayName(o, this.search) ||
              this.searchFriendByEmail(o, this.search)
          )
        : this.friends
    }
  },
  mounted() {
    const vm = this
    firebase
      .database()
      .ref('users')
      .on('child_added', function(data) {
        vm.friends.push(data.val())
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
