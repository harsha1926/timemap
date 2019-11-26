<template>
  <v-row wrap>
    <v-flex
      v-for="user in users"
      :key="user.id"
      xs12
      sm8
      md4
      la2
      xl2
      class="pa-1 mt-1"
    >
      <user :user="user" />
    </v-flex>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import User from './User'
export default {
  components: {
    User
  },
  data() {
    return {
      users: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  mounted() {
    const vm = this
    firebase
      .database()
      .ref('users/' + vm.user.uid + '/friends')
      .on('child_added', function(friendId) {
        firebase
          .database()
          .ref('users/' + friendId.key)
          .on('value', function(data) {
            vm.users.push(data.val())
          })
      })
  }
}
</script>
