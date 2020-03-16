<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row wrap>
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-list-item-title>Name</v-list-item-title>
            <v-list-item-action>Allow to contact?</v-list-item-action>
          </v-list-item>

          <v-row>
            <div style="background-color:#D8D8D8; height: 2px; width:100%;"></div>
          </v-row>

          <v-list-item v-for="friend in friendObjects" :key="friend.uid">
            <v-list-item-title>{{ friend.displayName }}</v-list-item-title>
            <v-list-item-action>
              <v-switch v-model="friend.allowContact" @change="updateAllowContact(friend, $event)"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
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
      friendObjects: []
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
