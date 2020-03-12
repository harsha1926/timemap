<template>
  <v-row v-if="friend" align="center" justify="space-between" class="mt-0 pt-0">
    <v-col @click="saveFeedback(-100)" cols="2" class="mt-0 pt-0">
      <v-avatar v-if="feedback == -100" size="60">
        <v-img src="emojis/1.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/1.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col @click="saveFeedback(-50)" cols="2" class="mt-0 pt-0">
      <v-avatar v-if="feedback == -50" size="60">
        <v-img src="emojis/2.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/2.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col @click="saveFeedback(50)" cols="2" class="mt-0 pt-0">
      <v-avatar v-if="feedback == 50" size="60">
        <v-img src="emojis/3.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/3.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col @click="saveFeedback(100)" cols="2" class="mt-0 pt-0">
      <v-avatar v-if="feedback == 100" size="60">
        <v-img src="emojis/4.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/4.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col
      v-if="feedback"
      cols="4"
      style="height: 90px"
      class="mt-0 pt-0 text-right"
    >
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
        :currentValueText="''"
        needle-color="steelblue"
        needle-transition="easeQuadInOut"
      />
    </v-col>
    <v-col v-else cols="4" style="height: 90px" class="text-right">
      <v-skeleton-loader
        class="mt-3 ml-2"
        right
        type="chip"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import VueSpeedometer from 'vue-speedometer'
import { firebaseDB } from '@/services/firebaseInit.js'

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
  watch: {
    feedback: {
      handler(newVal) {
        if (newVal && this.friend && this.friend.uid && this.uid) {
          const vm = this
          firebaseDB
            .ref(
              'rating/' +
                this.friend.uid +
                new Date()
                  .toLocaleDateString('en-US')
                  .split('/')
                  .join('') +
                '/' +
                this.uid
            )
            .set(newVal)
            .then(() => {
              vm.fetchRating(vm.friend.uid)
            })
        }
      }
    }
  },
  mounted() {
    const vm = this
    if (vm.friend && vm.friend.uid && vm.uid) {
      firebaseDB
        .ref(
          'rating/' +
            vm.friend.uid +
            new Date()
              .toLocaleDateString('en-US')
              .split('/')
              .join('') +
            '/' +
            vm.uid
        )
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
      firebaseDB
        .ref(
          'rating/' +
            uid +
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
    }
  }
}
</script>
