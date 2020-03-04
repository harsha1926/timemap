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
      <div style="background-color:#D8D8D8; height: 1px; width:100%;"></div>
    </v-row>

    <v-row class="mt-5 mb-5">
      <v-subheader class="body-1"
        >Let your freinds know if they made you happy today..</v-subheader
      >
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
        <rating :friendId="friend.uid" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import VueSpeedometer from 'vue-speedometer'
import Rating from './Rating'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  components: {
    Rating,
    VueSpeedometer
  },
  data() {
    return {
      friendObjects: [],
      ratings: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    sortedFriendsList() {
      return [...this.friendObjects].sort(function(x, y) {
        return x.isFavourite === y.isFavourite ? 0 : x.isFavourite ? -1 : 1
      })
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
    this.fetchRating(this.uid)
  },
  methods: {
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
    },
    fetchRating(uid) {
      const vm = this
      firebaseDB.ref('rating/' + uid).once('value', function(ratings) {
        vm.ratings = []
        ratings.forEach((rating) => {
          vm.ratings.push(rating.val())
        })
      })
    }
  }
}
</script>
