<template>
  <v-container fluid style="max-width: 600px; height: 85vh; max-height: 85%;">
    <v-row justify="center" class="ma-1 pa-1">
      <v-text-field
        v-model="search"
        outlined
        label="Find by email address.."
      ></v-text-field>
    </v-row>
    <add-friend
      v-for="friend in tobeFriends"
      :key="friend.uid"
      :friend="friend"
    />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import AddFriend from './AddFriend'
import { firebaseDB } from '@/services/firebaseInit.js'
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
    ...mapGetters('user', ['uid'])
  },
  watch: {
    search(newVal) {
      const vm = this
      if (newVal) {
        if (this.validateEmail(newVal)) {
          firebaseDB
            .ref('users')
            .orderByChild('email')
            .equalTo(newVal)
            .once('value', function(snapshot) {
              vm.tobeFriends = []
              snapshot &&
                snapshot.forEach((data) => {
                  if (data.key !== vm.uid) {
                    const friend = data.val()
                    firebaseDB
                      .ref('friends/' + vm.uid + '/' + friend.uid)
                      .once('value', function(data) {
                        if (data.val()) friend.isFriendAlready = true
                        vm.tobeFriends.push(friend)
                      })
                  }
                })
            })
        }
      } else {
        vm.tobeFriends = []
      }
    }
  },
  methods: {
    validateEmail(email) {
      const re = /\S+@\S+\.\S+/
      return re.test(email)
    },
    validatePhone(phone) {
      const phoneno = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
      return phoneno.test(phone)
    }
  }
}
</script>
