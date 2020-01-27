<template>
  <v-container v-if="gif" :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''">
    <v-row>
      <v-col class="mt-0 pt-0" cols="12">
        <v-img :src="gif.url" :height="height">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </template>
          <v-row justify="end" align="start" class="ma-1 pa-1 fill-height">
            <v-btn v-if="!loading" @click="addGIF" fab x-small color="white">
              <v-icon color="primary">mdi-check</v-icon>
            </v-btn>
            <v-progress-circular color="primary" v-else indeterminate></v-progress-circular>
          </v-row>
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <div style="background-color:#D8D8D8; height: 10px; width:100%;"></div>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    gif: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    height() {
      return this.$vuetify.breakpoint.xsOnly ? '180px' : '250px'
    }
  },
  methods: {
    addGIF() {
      this.loading = true
      this.$emit('gif-added', this.gif)
    }
  }
}
</script>
