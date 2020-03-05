<template>
  <friends />
</template>

<script>
import { mapGetters } from 'vuex'
import Friends from '~/components/friends/Friends'
export default {
  components: {
    Friends
  },
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted() {
    this.getUserCurrentLocation(this.uid)
  }
}
</script>
