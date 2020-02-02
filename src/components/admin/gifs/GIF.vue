<template>
  <v-container
    v-if="gif"
    :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''"
  >
    <v-row>
      <v-col class="mt-0 pt-0 text-center" cols="12">
        <v-img v-if="!forAvatar" :src="gif.url" :height="height">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
          <v-row justify="end" align="start" class="ma-1 pa-1 fill-height">
            <div v-if="!loading">
              <v-btn v-if="!selected" @click="addGIF" fab x-small color="white">
                <v-icon color="primary">mdi-check</v-icon>
              </v-btn>
              <v-btn v-else @click="removeGIF" fab x-small color="white">
                <v-icon color="primary">mdi-close</v-icon>
              </v-btn>
            </div>
            <v-progress-circular
              v-else
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </v-img>
        <v-avatar :size="height" v-else>
          <v-img :src="gif.url">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
            <v-row justify="center" align="center" class="fill-height">
              <div v-if="!loading">
                <v-btn
                  v-if="!selected"
                  @click="addGIF"
                  fab
                  x-small
                  color="white"
                >
                  <v-icon color="primary">mdi-check</v-icon>
                </v-btn>
                <v-btn v-else @click="removeGIF" fab x-small color="white">
                  <v-icon color="primary">mdi-close</v-icon>
                </v-btn>
              </div>
              <v-progress-circular
                v-else
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </v-img>
        </v-avatar>
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
    forAvatar: {
      type: Boolean,
      default() {
        return false
      }
    },
    gif: {
      type: Object,
      default() {
        return null
      }
    },
    selected: {
      type: Boolean,
      default() {
        return false
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
      let vm = this
      setTimeout(() => {
        vm.loading = false
      }, 1000)
    },
    removeGIF() {
      this.loading = true
      this.$emit('gif-removed', this.gif)
      let vm = this
      setTimeout(() => {
        vm.loading = false
      }, 1000)
    }
  }
}
</script>
