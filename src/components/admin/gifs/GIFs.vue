<template>
  <v-container :class="$vuetify.breakpoint.xsOnly ? 'ma-0 pa-0' : ''" fluid>
    <v-row align="center" justify="center">
      <v-col
        :cols="$vuetify.breakpoint.xsOnly ? '10' : '8'"
        sm="6"
        md="4"
        la="2"
      >
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
      <v-col cols="2" sm="1" md="1" la="1">
        <v-btn @click="refreshResults" small fab icon>
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="!$vuetify.breakpoint.xsOnly" cols="2" sm="1" md="1" la="1">
        <v-switch
          v-model="showSelected"
          color="primary"
          label="Show selected"
        ></v-switch>
      </v-col>
      <v-col v-if="!$vuetify.breakpoint.xsOnly" cols="2" sm="1" md="1" la="1">
        <v-switch
          v-model="forAvatar"
          color="primary"
          label="For avatar"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.breakpoint.xsOnly" align="center" justify="end">
      <v-col cols="6">
        <v-switch v-model="showSelected" label="Show selected"></v-switch>
      </v-col>
      <v-col cols="6">
        <v-switch
          v-model="forAvatar"
          color="primary"
          label="For avatar"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row v-if="loading" align="center" justify="center">
      <v-col cols="12">Loading...</v-col>
    </v-row>
    <v-row v-else-if="!showSelected" wrap>
      <v-col
        v-for="gif in gifs"
        :key="gif.url"
        :class="$vuetify.breakpoint.xsOnly ? 'mt-0 pt-0' : ''"
        cols="12"
        sm="6"
        md="4"
        la="2"
      >
        <gif
          :gif="gif"
          @gif-added="addGIF"
          :selected="false"
          :forAvatar="forAvatar"
        />
      </v-col>
      <v-snackbar
        v-model="showGIFAddedSnackbar"
        :timeout="1000"
        color="primary"
      >
        GIF selected successfully
        <v-icon>far fa-smile</v-icon>
      </v-snackbar>
    </v-row>
    <v-row v-else-if="showSelected" wrap>
      <v-col
        v-for="gif in existingGIFsByActivity"
        :key="gif.url"
        :class="$vuetify.breakpoint.xsOnly ? 'mt-0 pt-0' : ''"
        cols="12"
        sm="6"
        md="4"
        la="2"
      >
        <gif
          :gif="gif"
          @gif-removed="removeGIF"
          :selected="true"
          :forAvatar="forAvatar"
        />
      </v-col>
      <v-snackbar
        v-model="showGIFAddedSnackbar"
        :timeout="1000"
        color="primary"
      >
        GIF selected successfully
        <v-icon>far fa-smile</v-icon>
      </v-snackbar>
      <v-snackbar
        v-model="showGIFRemovedSnackbar"
        :timeout="1000"
        color="primary"
      >
        GIF removed successfully
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
      showGIFRemovedSnackbar: false,
      gifs: [],
      loading: false,
      existingGIFs: [],
      showSelected: false,
      forAvatar: false
    }
  },
  computed: {
    existingGIFsByActivity() {
      if (this.activity) {
        return this.existingGIFs.filter((o) => o.activity === this.activity.id)
      } else {
        return []
      }
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
  },
  mounted() {
    const vm = this
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
      return (
        this.existingGIFs.find((o) => o.url === gif.url) ||
        this.gifs.find((o) => o.url === gif.url)
      )
    },
    getRandomKeyword(obj) {
      const keys = Object.keys(obj)
      return keys[(keys.length * Math.random()) << 0]
    },
    addGIF(gif) {
      const vm = this
      const payload = {
        activity: gif.activity.id,
        url: gif.url,
        forAvatar: this.forAvatar
      }
      firebaseDB
        .ref('gifs')
        .push(payload)
        .then(() => {
          vm.existingGIFs.push(payload)
          const index = vm.gifs.findIndex((o) => o.url === gif.url)
          if (index > -1) {
            setTimeout(() => {
              vm.showGIFAddedSnackbar = true
              vm.gifs.splice(index, 1)
            }, 3000)
          }
        })
    },
    removeGIF(gif) {
      const vm = this
      firebaseDB
        .ref('gifs')
        .orderByChild('url')
        .equalTo(gif.url)
        .once('value', function(snapshot) {
          snapshot.forEach((o) => {
            firebaseDB
              .ref('gifs/' + o.key)
              .set(null)
              .then(() => {
                const index = vm.existingGIFs.findIndex(
                  (o) => o.url === gif.url
                )
                if (index > -1) {
                  setTimeout(() => {
                    vm.showGIFRemovedSnackbar = true
                    vm.existingGIFs.splice(index, 1)
                  }, 3000)
                }
              })
          })
        })
    },
    getGifs(activity, limit) {
      this.loading = true
      const vm = this
      const keyword = this.getRandomKeyword(activity.keywords)
      fetchRandomGIFs(keyword, limit).then((res) => {
        res.data.results.map((eachGIF) => {
          const gif = {
            activity,
            url: eachGIF.media[0].tinygif.url
          }
          if (!this.isAlreadyAvailable(gif)) {
            this.gifs.push(gif)
          }
        })
        vm.loading = false
      })
    },
    refreshResults() {
      if (this.activity) {
        this.gifs = []
        this.getGifs(this.activity, 10)
      }
    }
  }
}
</script>
