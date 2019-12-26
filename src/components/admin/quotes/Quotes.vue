<template>
  <v-row align="center" justify="center">
    <v-card max-width="400">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <template v-slot:default>
              <v-row>
                <v-col cols="4">Add Quote</v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <add-quote @quote-added="addQuote"></add-quote>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card>
        <v-data-table :loading="loading" :headers="headers" :items="quotes">
          <template v-slot:item.actions="{ item }">
            <v-btn
              @click="
                showEditQuoteDialog = true
                selectedQuote = item
              "
              color="primary"
              fab
              icon
              x-small
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="deleteQuote(item)" color="primary" fab icon x-small>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
    <v-snackbar v-model="showSnackbar" :timeout="1000" :color="snackColor">
      {{ snackText }}
      <v-icon>{{ snackIcon }}</v-icon>
    </v-snackbar>
    <v-dialog v-model="showEditQuoteDialog" max-width="400" eager>
      <v-card>
        <add-quote
          :quote="selectedQuote"
          @quote-updated="updateQuote"
          @dialog-closed="showEditQuoteDialog = false"
        ></add-quote>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import AddQuote from './AddQuote'
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  components: {
    AddQuote
  },
  data() {
    return {
      showEditQuoteDialog: false,
      selectedQuote: null,
      loading: false,
      headers: [
        { text: 'Activity', value: 'activity' },
        { text: 'Category', value: 'category' },
        { text: 'Quote', value: 'quote' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      quotes: [],
      showSnackbar: false,
      snackColor: 'primary',
      snackText: '',
      snackIcon: ''
    }
  },
  mounted() {
    const vm = this
    vm.loading = true
    firebaseDB.ref('quotes').once('value', function(snapshot) {
      snapshot.forEach((data) => {
        vm.quotes.push({
          quote: data.val().quote,
          activity: data.val().activity,
          category: data.val().category,
          uid: data.key
        })
      })
      vm.loading = false
    })
  },
  methods: {
    addQuote(item) {
      this.quotes.unshift(item)
      this.showSnackbar = true
      this.snackText = 'Quote added successfully'
      this.snackIcon = 'far fa-smile'
    },
    updateQuote(item) {
      const index = this.quotes.findIndex((o) => o.uid === item.uid)
      if (index > -1) {
        this.quotes.splice(index, 1, item)
      }
      this.showEditQuoteDialog = false
      this.selectedQuote = null
      this.showSnackbar = true
      this.snackText = 'Quote updated successfully'
      this.snackIcon = 'far fa-smile'
    },
    deleteQuote(item) {
      const vm = this
      const index = vm.quotes.findIndex((o) => o.uid === item.uid)
      if (index > -1) {
        firebaseDB
          .ref('quotes/' + item.uid)
          .set(null)
          .then(() => {
            vm.quotes.splice(index, 1)
            vm.showSnackbar = true
            vm.snackText = 'Quote deleted successfully'
            vm.snackIcon = 'far fa-smile'
          })
          .catch((error) => {
            console.error(error)
            vm.showSnackbar = true
            vm.snackText = 'Failed to delete Quote'
            vm.snackIcon = 'far fa-frown'
          })
      }
    }
  }
}
</script>
