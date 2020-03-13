<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row wrap justify="center" align="center">
      <v-subheader class="title">How good were you today?</v-subheader>
      <v-col cols="12" sm="6" md="4" la="2" class="text-center">
        <vue-speedometer
          :minValue="-100"
          :maxValue="100"
          :value="rating"
          :needleTransitionDuration="4000"
          :maxSegmentLabels="5"
          :segments="1000"
          :height="200"
          needle-color="steelblue"
          needle-transition="easeQuadInOut"
        />
      </v-col>
    </v-row>

    <v-row>
      <div style="background-color:#D8D8D8; height: 10px; width:100%;"></div>
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
        <friend
          :friendId="friend.uid"
          :isFavourite="friend.isFavourite"
          @friendRemoved="friendRemoved"
          @favourite-updated="favouriteUpdated"
          :gifs="gifs"
          @friend-data-fetched="addFriendData"
        />
      </v-col>
      <v-snackbar
        v-model="showFriendRemovedSnackbar"
        :timeout="1000"
        color="primary"
      >
        You are not watching {{ removedFriendName }} anymore
        <v-icon>far fa-frown</v-icon>
      </v-snackbar>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import VueSpeedometer from 'vue-speedometer'
import Friend from './Friend'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  components: {
    Friend,
    VueSpeedometer
  },
  data() {
    return {
      showFriendRemovedSnackbar: false,
      removedFriendName: '',
      friendObjects: [],
      gifs: [],
      ratings: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    ...mapGetters('app', ['search']),
    sortedFriendsList() {
      const list = this.friendObjects.slice()
      if (!this.search) {
        return list.sort(function(x, y) {
          return x.isFavourite === y.isFavourite ? 0 : x.isFavourite ? -1 : 1
        })
      } else {
        return list
          .filter(
            (o) =>
              !o.displayName ||
              (o.displayName &&
                o.displayName.toUpperCase().includes(this.search.toUpperCase()))
          )
          .sort(function(x, y) {
            return x.isFavourite === y.isFavourite ? 0 : x.isFavourite ? -1 : 1
          })
      }
    },
    rating() {
      if (this.ratings.length) {
        return Math.ceil(
          this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length
        )
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.fetchFriendsList()
    this.fetchGIFs()
    this.fetchRating()
  },
  methods: {
    addFriendData(friendData) {
      if (friendData) {
        const index = this.friendObjects.findIndex(
          (o) => o.uid === friendData.uid
        )
        if (index > -1) {
          this.friendObjects.splice(index, 1, friendData)
        }
      }
    },
    fetchRating() {
      const vm = this
      firebaseDB
        .ref(
          'rating/' +
            vm.uid +
            new Date()
              .toLocaleDateString('en-US')
              .split('/')
              .join('')
        )
        .once('value', function(ratings) {
          vm.ratings = []
          ratings.forEach((rating) => {
            vm.ratings.push(rating.val())
          })
        })
    },
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
            isFavourite: friend.val().isFavourite,
            displayName: friend.val().displayName
          })
        })
      })
    }
  }
}
</script>
