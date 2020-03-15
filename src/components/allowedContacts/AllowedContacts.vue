<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row wrap>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          hide-details
          label="Search"
        ></v-text-field>
        <v-data-table
          :search="search"
          :items="friendObjects"
          :headers="headers"
        >
          <template v-slot:item.allowContact="{ item }">
            <v-switch
              v-model="item.allowContact"
              @change="updateAllowContact(item, $event)"
            ></v-switch>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  data() {
    return {
      search: null,
      friendObjects: [],
      headers: [
        { text: 'Name', value: 'displayName' },
        { text: 'Allow to contact you?', value: 'allowContact' }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted() {
    this.fetchFriendsList()
  },
  methods: {
    updateAllowContact(friend, value) {
      firebaseDB.ref('allowContact/' + this.uid + '/' + friend.uid).set(value)
      this.$set(friend, 'allowContact', value)
    },
    fetchFriendsList() {
      const vm = this
      firebaseDB.ref('watching/' + vm.uid).once('value', function(friends) {
        vm.friendObjects = []
        friends.forEach((friend) => {
          firebaseDB
            .ref('users/' + friend.val().uid)
            .once('value', function(friendData) {
              const friendDataObj = friendData.val()
              firebaseDB
                .ref('allowContact/' + vm.uid + '/' + friendDataObj.uid)
                .once('value', function(allow) {
                  friendDataObj.allowContact = allow.val()
                  vm.friendObjects.push(friendDataObj)
                })
            })
        })
      })
    }
  }
}
</script>
