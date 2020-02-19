<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row wrap justify="center" align="center">
      <v-subheader class="title">How good were you today?</v-subheader>
      <v-col cols="12" sm="6" md="4" la="2" class="text-center">
        <vue-speedometer
          :minValue="-100"
          :maxValue="100"
          :value="0"
          needleColor="steelblue"
          :needleTransitionDuration="4000"
          :maxSegmentLabels="5"
          :segments="1000"
          needleTransition="easeQuadInOut"
          :height="200"
        />
      </v-col>
    </v-row>

    <v-row>
      <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
    </v-row>

    <v-row class="mt-5 mb-5">
      <v-subheader class="body-1">Let your freinds know if they made you happy today..</v-subheader>
    </v-row>

    <v-row wrap>
      <v-col
        v-for="friend in sortedFriendsList"
        :key="friend.uid"
        :class="$vuetify.breakpoint.xsOnly ? 'mt-0 pt-0' : ''"
        cols="12"
        sm="6"
        md="4"
        la="2"
      >
        <rating
          :friendId="friend.uid"
          :isFavourite="friend.isFavourite"
          @friendRemoved="friendRemoved"
          @favourite-updated="favouriteUpdated"
          :gifs="gifs"
        />
      </v-col>
      <v-snackbar v-model="showFriendRemovedSnackbar" :timeout="1000" color="primary">
        You are not watching {{ removedFriendName }} anymore
        <v-icon>far fa-frown</v-icon>
      </v-snackbar>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Rating from './Rating'
import { firebaseDB } from '@/services/firebaseInit.js'
import VueSpeedometer from 'vue-speedometer'

export default {
  components: {
    Rating,
    VueSpeedometer
  },
  data() {
    return {
      showFriendRemovedSnackbar: false,
      removedFriendName: '',
      friendObjects: [],
      gifs: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    sortedFriendsList() {
      return [...this.friendObjects].sort(function(x, y) {
        return x.isFavourite === y.isFavourite ? 0 : x.isFavourite ? -1 : 1
      })
    }
  },
  mounted() {
    this.fetchFriendsList()
    this.fetchGIFs()
  },
  methods: {
    favouriteUpdated(updatedFriend) {
      const friend = this.friendObjects.find((o) => o.uid === updatedFriend.uid)
      if (friend) {
        friend.isFavourite = updatedFriend.isFavourite
      }
    },
    fetchGIFs() {
      const vm = this
      firebaseDB.ref('gifs').once('value', function(snapshot) {
        snapshot.forEach((gif) => {
          vm.gifs.push(gif.val())
        })
      })
    },
    friendRemoved(removedFriend) {
      const index = this.friendObjects.findIndex(
        (o) => o.uid === removedFriend.uid
      )
      if (index > -1) {
        this.friendObjects.splice(index, 1)
        this.removedFriendName = removedFriend.displayName
        this.showFriendRemovedSnackbar = true
      }
    },
    fetchFriendsList() {
      const vm = this
      firebaseDB.ref('watching/' + vm.uid).once('value', function(friends) {
        vm.friendObjects = []
        friends.forEach((friend) => {
          vm.friendObjects.push({
            uid: friend.val().uid,
            isFavourite: friend.val().isFavourite
          })
        })
      })
    }
  }
}
</script>
