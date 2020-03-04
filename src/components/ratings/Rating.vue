<template>
  <v-container
    :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''"
    @click="showFriendPhoto = false"
  >
    <v-row v-if="loading">
      <v-col cols="12">
        <v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
        <v-skeleton-loader type="list-item"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-if="friend" align="center">
      <v-col cols="4">
        <v-skeleton-loader
          :height="92"
          v-if="!feedback"
          type="image"
        ></v-skeleton-loader>
        <v-flex v-else>
          <vue-speedometer
            :minValue="-100"
            :maxValue="100"
            :needleHeightRatio="0.5"
            :maxSegmentLabels="0"
            :needleTransitionDuration="4000"
            :ringWidth="10"
            :height="85"
            :width="120"
            :value="rating"
            needle-color="steelblue"
            needle-transition="easeQuadInOut"
          />
        </v-flex>
      </v-col>

      <v-col cols="5">
        <v-flex class="subtitle-1 font-weight-medium">
          {{ displayNameCaptilize }}
        </v-flex>
      </v-col>

      <v-col @click.stop="showFriendPhoto = true" cols="3">
        <v-avatar :size="60">
          <v-img :src="friend.photoURL"></v-img>
        </v-avatar>
      </v-col>
    </v-row>

    <v-row v-if="friend" justify="center" align="center" class="mt-0 pt-0">
      <v-col cols="12" class="text-center mt-0 pt-0">
        <feedback :feedback="feedback" @feedback-clicked="saveFeedback" />
      </v-col>
    </v-row>
    <v-row>
      <div style="background-color:#D8D8D8; height: 10px; width:100%;"></div>
    </v-row>
    <v-overlay v-if="friend && friend.photoURL" :value="showFriendPhoto">
      <v-avatar size="300" tile>
        <v-img :src="friend.photoURL" content></v-img>
      </v-avatar>
    </v-overlay>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import VueSpeedometer from 'vue-speedometer'
import Feedback from './Feedback'
import { firebaseDB } from '@/services/firebaseInit.js'

export default {
  components: {
    Feedback,
    VueSpeedometer
  },
  props: {
    friendId: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      showFriendPhoto: false,
      loading: false,
      friend: null,
      feedback: null,
      ratings: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
    displayNameCaptilize() {
      if (!this.friend || (this.friend && !this.friend.displayName)) return ''
      return this.friend.displayName
        .split(' ')
        .map((o) => this.capitalizeFirstLetter(o))
        .join(' ')
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
  watch: {
    feedback: {
      handler(newVal) {
        if (newVal && this.friendId && this.uid) {
          const vm = this
          firebaseDB
            .ref('rating/' + this.friendId + '/' + this.uid)
            .set(newVal)
            .then(() => {
              vm.fetchRating(vm.friendId)
            })
        }
      }
    }
  },
  mounted() {
    if (this.friendId) {
      const vm = this
      vm.loading = true
      firebaseDB
        .ref('users/' + vm.friendId)
        .once('value', function(data) {
          vm.friend = data.val()
        })
        .finally(() => {
          vm.loading = false
        })

      firebaseDB
        .ref('rating/' + vm.friendId + '/' + vm.uid)
        .once('value', function(data) {
          if (data.val()) {
            vm.feedback = data.val()
          }
        })

      this.fetchRating(this.friendId)
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    saveFeedback(feedback) {
      this.feedback = feedback
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
