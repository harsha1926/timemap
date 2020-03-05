<template>
  <v-row v-if="friend" align="center" justify="space-between" class="mt-0 pt-0">
    <v-col cols="2" class="mt-0 pt-0" @click="saveFeedback(-100)">
      <v-avatar v-if="feedback == -100" size="60">
        <v-img src="emojis/1.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/1.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="2" class="mt-0 pt-0" @click="saveFeedback(-50)">
      <v-avatar v-if="feedback == -50" size="60">
        <v-img src="emojis/2.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/2.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="2" class="mt-0 pt-0" @click="saveFeedback(50)">
      <v-avatar v-if="feedback == 50" size="60">
        <v-img src="emojis/3.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/3.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="2" class="mt-0 pt-0" @click="saveFeedback(100)">
      <v-avatar v-if="feedback == 100" size="60">
        <v-img src="emojis/4.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/4.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="4" class="mt-0 pt-0 text-right">
      <vue-speedometer
        :minValue="-100"
        :maxValue="100"
        :value="rating"
        :needleTransitionDuration="4000"
        :maxSegmentLabels="0"
        :segments="1000"
        :height="70"
        :width="100"
        :needleHeightRatio="0.4"
        :ringWidth="5"
        needle-color="steelblue"
        needle-transition="easeQuadInOut"
        :currentValueText="''"
      />
    </v-col>
  </v-row>
</template>

<script>
import { firebaseDB } from '@/services/firebaseInit.js'
import { mapGetters } from 'vuex'
import VueSpeedometer from 'vue-speedometer'

export default {
  components: {
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
  mounted() {
    let vm = this
    if (vm.friend && vm.friend.uid && vm.uid) {
      firebaseDB
        .ref('rating/' + vm.friend.uid + '/' + vm.uid)
        .once('value', function(data) {
          if (data.val()) {
            vm.feedback = data.val()
          }
        })

      vm.fetchRating(vm.friend.uid)
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
  }
}
</script>
