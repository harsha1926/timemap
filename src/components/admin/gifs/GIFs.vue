<template>
  <v-container fluid>
    <v-row align="center" justify="center" wrap>
      <v-col cols="12">
        <v-tabs v-model="tab" grow>
          <v-tab :key="0">Main</v-tab>
          <v-tab :key="1">Avatar</v-tab>
          <v-tab :key="2">Routine</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <v-row>
              <v-col cols="12">
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
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between">
              <v-col cols="6" class="text-left">
                <v-switch
                  v-model="showSelected"
                  label="Show Selected"
                ></v-switch>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-btn @click="refreshResults" small fab icon>
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-row>
              <v-col cols="12">
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
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between">
              <v-col cols="6" class="text-left">
                <v-switch
                  v-model="showSelected"
                  label="Show Selected"
                ></v-switch>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-btn @click="refreshResults" small fab icon>
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item :key="2">
            <v-row align="center" justify="space-between">
              <v-col cols="6" class="text-left">
                <v-switch
                  v-model="showSelected"
                  label="Show Selected"
                ></v-switch>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-btn @click="refreshResults" small fab icon>
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-row v-if="loading" align="center" justify="center">
      <v-col cols="12">Loading...</v-col>
    </v-row>
    <v-row v-else-if="!showSelected" wrap>
      <v-col
        v-for="(gif, index) in gifs"
        :key="index"
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
        v-for="(gif, index) in existingGIFsByActivity"
        :key="index"
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
      tab: 0,
      activities: [],
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
        if (this.tab === 1) {
          return this.existingGIFs.filter(
            (o) => o.activity === this.activity.id && !!o.forAvatar
          )
        } else {
          return this.existingGIFs.filter(
            (o) => o.activity === this.activity.id && !o.forAvatar
          )
        }
      } else {
        return []
      }
    }
  },
  watch: {
    tab(newVal) {
      if (newVal === 0) {
        this.forAvatar = false
        this.activity = null
      } else if (newVal === 1) {
        this.forAvatar = true
        this.activity = null
      } else if (newVal === 2) {
        this.forAvatar = false
        this.activity = {
          id: 'routine',
          keywords: { routine: true, 'daily routine': true }
        }
      }
    },
    activity(newVal) {
      this.gifs = []
      if (newVal) {
        this.getGifs(newVal, 25)
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
      if (this.tab === 0) {
        return this.existingGIFs.find((o) => o.url === gif.url)
      } else if (this.tab === 1) {
        return this.existingGIFs.find((o) => o.url === gif.url && o.forAvatar)
      } else if (this.tab === 2) {
        this.existingGIFs.find((o) => o.url === gif.url && o.id === 'routine')
      }
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
        forAvatar: false
      }

      if (this.tab === 1) {
        payload.forAvatar = true
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
            }, 500)
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
            url: eachGIF.media[0].gif.url
          }
          if (this.forAvatar) {
            gif.url = eachGIF.media[0].tinygif.url
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
        this.getGifs(this.activity, 25)
      }
    }
  }
}
</script>
