<template>
  <v-row align="center" justify="center">
    <v-flex>
      <v-card>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <template v-slot:default>
                  <v-row>
                    <v-col cols="4" class="primary--text">Add GIF</v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <add-gif @gif-added="addGIF"></add-gif>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card>
            <v-data-table :loading="loading" :headers="headers" :items="gifs">
              <template v-slot:item.url="{ item }">
                <v-avatar>
                  <v-img
                    :src="item.url"
                    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                  ></v-img>
                </v-avatar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  @click="
                showEditGIFDialog = true
                selectedGIF = item
              "
                  color="primary"
                  fab
                  icon
                  x-small
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="deleteGIF(item)" color="primary" fab icon x-small>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-card-text>
      </v-card>
      <v-snackbar v-model="showSnackbar" :timeout="1000" :color="snackColor">
        {{ snackText }}
        <v-icon>{{ snackIcon }}</v-icon>
      </v-snackbar>
      <v-dialog v-model="showEditGIFDialog" max-width="400" eager>
        <v-card>
          <add-gif
            :gif="selectedGIF"
            @gif-updated="updateGIF"
            @dialog-closed="showEditGIFDialog = false"
          ></add-gif>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-row>
</template>
<script>
import AddGif from './AddGIF'
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  components: {
    AddGif
  },
  data() {
    return {
      showEditGIFDialog: false,
      selectedGIF: null,
      loading: false,
      headers: [
        { text: 'Activity', value: 'activity' },
        { text: 'Category', value: 'category' },
        { text: 'Preview', value: 'url' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      gifs: [],
      showSnackbar: false,
      snackColor: 'primary',
      snackText: '',
      snackIcon: ''
    }
  },
  mounted() {
    const vm = this
    vm.loading = true
    firebaseDB.ref('gifs').once('value', function(snapshot) {
      snapshot.forEach((data) => {
        vm.gifs.push({
          url: data.val().url,
          activity: data.val().activity,
          category: data.val().category,
          uid: data.key
        })
      })
      vm.loading = false
    })
  },
  methods: {
    addGIF(item) {
      this.gifs.unshift(item)
      this.showSnackbar = true
      this.snackText = 'GIF added successfully'
      this.snackIcon = 'far fa-smile'
    },
    updateGIF(item) {
      const index = this.gifs.findIndex((o) => o.uid === item.uid)
      if (index > -1) {
        this.gifs.splice(index, 1, item)
      }
      this.showEditGIFDialog = false
      this.selectedGIF = null
      this.showSnackbar = true
      this.snackText = 'GIF updated successfully'
      this.snackIcon = 'far fa-smile'
    },
    deleteGIF(item) {
      const vm = this
      const index = vm.gifs.findIndex((o) => o.uid === item.uid)
      if (index > -1) {
        firebaseDB
          .ref('gifs/' + item.uid)
          .set(null)
          .then(() => {
            vm.gifs.splice(index, 1)
            vm.showSnackbar = true
            vm.snackText = 'GIF deleted successfully'
            vm.snackIcon = 'far fa-smile'
          })
          .catch((error) => {
            console.error(error)
            vm.showSnackbar = true
            vm.snackText = 'Failed to delete GIF'
            vm.snackIcon = 'far fa-frown'
          })
      }
    }
  }
}
</script>