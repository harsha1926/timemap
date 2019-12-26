<template>
  <v-card :disabled="loading">
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="quoteText"
          :rules="[rules.required]"
          label="Quote"
          outlined
          clearable
        ></v-text-field>
        <v-autocomplete
          :items="activities"
          v-model="activity"
          :rules="[rules.required]"
          label="Activity"
          outlined
          clearable
        ></v-autocomplete>
        <v-row align="center" justify="center">
          <v-col cols="9">
            <v-autocomplete
              :items="categories"
              v-model="category"
              :rules="[rules.required]"
              label="Category"
              outlined
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-btn text color="primary" @click="openAddCategoryDialog">Add</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-row
        v-if="error"
        align="center"
        justify="center"
        class="overline error--text ma-2 pa-2"
      >{{ errorMsg }}</v-row>
      <v-dialog v-model="showAddCategoryDialog">
        <v-card>
          <v-card-text>
            <v-text-field single-line v-model="newCategory" label="New Category"></v-text-field>
            <v-row justify="end">
              <v-btn @click="addCategory" color="primary">Save</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions>
      <v-row justify="end" class="ma-2 pa-2">
        <v-btn v-if="!quote" @click="addQuote" color="primary">Submit</v-btn>
        <v-btn v-if="quote" @click="addQuote" color="primary">Update</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  props: {
    quote: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      error: false,
      errorMsg: null,
      loading: false,
      valid: null,
      activity: null,
      activities: [],
      category: null,
      categories: [],
      quoteText: null,
      rules: {
        required: (value) => !!value || 'Required.'
      },
      showAddCategoryDialog: false,
      newCategory: null
    }
  },
  watch: {
    quote: {
      handler: function(newVal) {
        if (newVal) {
          this.quoteText = newVal.quote
          this.activity = newVal.activity
          this.category = newVal.category
        } else {
          this.quoteText = null
          this.activity = null
          this.category = null
        }
      },
      deep: true
    }
  },
  mounted() {
    const vm = this
    firebaseDB.ref('activities').once('value', function(snapshot) {
      snapshot.forEach((data) => {
        vm.activities.push(data.key)
      })
    })
    firebaseDB.ref('categories').once('value', function(snapshot) {
      snapshot.forEach((data) => {
        vm.categories.push(data.key)
      })
    })
  },
  methods: {
    openAddCategoryDialog() {
      this.showAddCategoryDialog = true
    },
    addCategory() {
      const vm = this
      if (vm.newCategory)
        firebaseDB
          .ref('categories/' + vm.newCategory)
          .set(true)
          .then(() => {
            vm.categories.push(vm.newCategory)
            vm.showAddCategoryDialog = false
            vm.newCategory = null
          })
    },
    addQuote() {
      const vm = this
      vm.loading = true
      const payload = {
        quote: vm.quoteText,
        activity: vm.activity,
        category: vm.category
      }
      if (vm.quote) {
        firebaseDB
          .ref('quotes/' + vm.quote.uid)
          .update(payload)
          .then(() => {
            payload.uid = vm.quote.uid
            vm.$emit('quote-updated', payload)
          })
          .catch((error) => {
            vm.error = true
            vm.errorMsg = error.message
          })
          .finally(() => {
            vm.loading = false
            vm.$refs.form.reset()
          })
      } else {
        firebaseDB
          .ref('quotes')
          .push(payload)
          .then((added) => {
            payload.uid = added.key
            vm.$emit('quote-added', payload)
          })
          .catch((error) => {
            vm.error = true
            vm.errorMsg = error.message
          })
          .finally(() => {
            vm.loading = false
            vm.$refs.form.reset()
          })
      }
    }
  }
}
</script>
