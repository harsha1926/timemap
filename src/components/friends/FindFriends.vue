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
      v-for="friend in tobeFriends"
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
    })
  },
  watch: {
    search(newVal) {
      const vm = this
      if (newVal) {
        if (this.validateEmail(newVal)) {
          firebase
            .database()
            .ref('users')
            .orderByChild('email')
            .equalTo(newVal)
            .once('value', function(snapshot) {
              vm.tobeFriends = []
              snapshot &&
                snapshot.forEach((data) => {
                  if (data.key !== vm.user.uid) {
                    const friend = data.val()
                    friend.uid = data.key
                    firebase
                      .database()
                      .ref('friends/' + vm.user.uid + '/' + friend.uid)
                      .once('value', function(data) {
                        if (data.val()) friend.isFriendAlready = true
                        vm.tobeFriends.push(friend)
                      })
                  }
                })
            })
        } else if (this.validatePhone(newVal)) {
          firebase
            .database()
            .ref('users')
            .orderByChild('phoneNumber')
            .equalTo(newVal)
            .once('value', function(snapshot) {
              vm.tobeFriends = []
              snapshot &&
                snapshot.forEach((data) => {
                  if (data.key !== vm.user.uid) {
                    const friend = data.val()
                    friend.uid = data.key
                    firebase
                      .database()
                      .ref('friends/' + vm.user.uid + '/' + friend.uid)
                      .once('value', function(data) {
                        if (data.val()) friend.isFriendAlready = true
                        vm.tobeFriends.push(friend)
                      })
                  }
                })
            })
        } else {
          vm.tobeFriends = []
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
