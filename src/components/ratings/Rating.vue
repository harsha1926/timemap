<template>
  <div>
    <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
    <feedback v-else-if="friend" :feedback="feedback" @feedback-clicked="saveFeedback" />
  </div>
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
    friend: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      feedback: null,
      ratings: []
    }
  },
  computed: {
    ...mapGetters('user', ['uid']),
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
        if (newVal && this.friend && this.friend.uid && this.uid) {
          const vm = this
          firebaseDB
            .ref('rating/' + this.friend.uid + '/' + this.uid)
            .set(newVal)
            .then(() => {
              vm.fetchRating(vm.friend.uid)
            })
        }
      }
    }
  },
  mounted() {
    if (this.friend && this.friend.uid) {
      const vm = this
      vm.loading = true
      firebaseDB
        .ref('rating/' + vm.friend.uid + '/' + vm.uid)
        .once('value', function(data) {
          if (data.val()) {
            vm.feedback = data.val()
            vm.loading = false
          }
        })

      this.fetchRating(this.friend.uid)
    }
  },
  methods: {
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
