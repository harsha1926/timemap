<template>
  <v-container
    :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''"
    fluid
    style="max-width: 600px;"
  >
    <v-row wrap>
      <v-col :class="$vuetify.breakpoint.xsOnly ? 'mt-0 pt-0' : ''" cols="12">
        <v-tabs v-model="tab" grow>
          <v-tab :key="0">Contacts</v-tab>
          <v-tab :key="1">You are watched by</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <v-row wrap>
              <v-col v-for="friendId in contacts" :key="friendId" cols="12">
                <add-friend :friendId="friendId" />
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-row wrap>
              <v-col v-for="friendId in watchers" :key="friendId" cols="12">
                <add-friend
                  :friendId="friendId"
                  :showRemove="true"
                  @watcher-removed="removeWatcher"
                />
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
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
      tab: 0,
      contacts: [],
      watchers: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    ...mapGetters('app', ['search'])
  },
  mounted() {
    this.getAllUsers()
    this.getWatchers()
  },
  methods: {
    removeWatcher(friend) {
      const index = this.watchers.findIndex((o) => o === friend.uid)
      if (index > -1) {
        this.watchers.splice(index, 1)
      }
    },
    getWatchers() {
      const vm = this
      firebaseDB
        .ref('watching')
        .orderByKey()
        .once('value', function(snapshot) {
          snapshot.forEach((data) => {
            if (data.val()) {
              const obj = data.val()
              for (const key in obj) {
                if (obj[key] && obj[key].uid === vm.uid) {
                  vm.watchers.push(data.key)
                }
              }
            }
          })
        })
    },
    getAllUsers() {
      const vm = this
      firebaseDB.ref('users').once('value', function(snapshot) {
        snapshot.forEach((user) => {
          if (vm.uid !== user.val().uid) {
            vm.contacts.push(user.val().uid)
          }
        })
      })
    }
  }
}
</script>
