<template>
  <ratings />
</template>

<script>
import { mapGetters } from 'vuex'
import Ratings from '~/components/ratings/Ratings'
export default {
  components: {
    Ratings
  },
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted() {
    this.getUserCurrentLocation(this.uid)
  }
}
</script>
