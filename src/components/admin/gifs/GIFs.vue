<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4" la="2">
        <v-autocomplete
          v-model="activity"
          :items="activities"
          autocomplete="off"
          label="Select activity"
          return-object
          item-text="direct"
          item-value="id"
          hide-details
          outlined
          rounded
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row v-if="loading" align="center" justify="center">
      <v-col cols="12">Loading...</v-col>
    </v-row>
    <v-row v-else wrap>
      <v-col
        v-for="gif in gifs"
        :key="gif.url"
        :class="$vuetify.breakpoint.xsOnly ? 'mt-0 pt-0' : ''"
        cols="12"
        sm="6"
        md="4"
        la="2"
      >
        <gif :gif="gif" @gif-added="addGIF" />
      </v-col>
      <v-snackbar v-model="showGIFAddedSnackbar" :timeout="1000" color="primary">
        GIF selected successfully
        <v-icon>far fa-smile</v-icon>
      </v-snackbar>
    </v-row>
  </v-container>
</template>
<script>
import Gif from './GIF'
import { firebaseDB } from '@/services/firebaseInit.js'
import { fetchRandomGIFs } from '@/api/gifs'
export default {
  components: {
    Gif
  },
  data() {
    return {
      activities: [
        {
          id: 'sleep',
          direct: 'I am sleeping',
          keywords: {
            sleeping: true,
            'on bed': true
          }
        },
        {
          id: 'free',
          direct: 'I am free',
          keywords: {
            'im free': true,
            offwork: true
          }
        }
      ],
      activity: null,
      showGIFAddedSnackbar: false,
      gifs: [],
      loading: false,
      existingGIFs: []
    }
  },
  mounted() {
    let vm = this
    firebaseDB.ref('activities').once('value', (snapshot) => {
      snapshot.forEach((activity) => {
        vm.activities.push(activity.val())
      })
    })
    firebaseDB.ref('gifs').once('value', (snapshot) => {
      snapshot.forEach((gif) => {
        vm.existingGIFs.push(gif.val())
      })
    })
  },
  methods: {
    isAlreadyAvailable(gif) {
      return this.existingGIFs.find((o) => o.url === gif.url)
    },
    getRandomKeyword(obj) {
      var keys = Object.keys(obj)
      return keys[(keys.length * Math.random()) << 0]
    },
    addGIF(gif) {
      let vm = this
      firebaseDB
        .ref('gifs')
        .push({
          activity: gif.activity.id,
          url: gif.url
        })
        .then(() => {
          let index = vm.gifs.findIndex((o) => o.url === gif.url)
          if (index > -1) {
            setTimeout(() => {
              vm.showGIFAddedSnackbar = true
              vm.gifs.splice(index, 1)
            }, 3000)
          }
        })
    },
    getGifs(activity, limit) {
      this.loading = true
      let vm = this
      let keyword = this.getRandomKeyword(activity.keywords)
      fetchRandomGIFs(keyword, limit).then((res) => {
        res.data.results.map((eachGIF) => {
          let gif = {
            activity: activity,
            url: eachGIF.media[0].tinygif.url
          }
          if (!this.isAlreadyAvailable(gif)) {
            this.gifs.push(gif)
          }
        })
        vm.loading = false
      })
    }
  },
  watch: {
    activity(newVal) {
      this.gifs = []
      if (newVal) {
        this.getGifs(newVal, 10)
      }
    },
    gifs(newVal) {
      if (this.activity && newVal.length < 5) {
        this.getGifs(this.activity, 5)
      }
    }
  }
}
</script>