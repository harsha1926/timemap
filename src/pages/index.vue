<template>
  <friends />
</template>

<script>
import Friends from '~/components/friends/Friends'
import { mapGetters } from 'vuex'
export default {
  components: {
    Friends
  },
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted: function() {
    this.getUserCurrentLocation(this.uid)
  }
}
</script>
