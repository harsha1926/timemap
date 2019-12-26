<template>
  <v-card :disabled="loading">
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="url"
          :rules="[rules.required]"
          label="URL"
          outlined
          clearable
        ></v-text-field>
        <v-card v-if="url" class="mb-5">
          <v-img
            :src="url"
            height="200px"
            gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          ></v-img>
        </v-card>
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
            <v-btn @click="openAddCategoryDialog" text color="primary"
              >Add</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-row
        v-if="error"
        align="center"
        justify="center"
        class="overline error--text ma-2 pa-2"
        >{{ errorMsg }}</v-row
      >
      <v-dialog v-model="showAddCategoryDialog">
        <v-card>
          <v-card-text>
            <v-text-field
              v-model="newCategory"
              single-line
              label="New Category"
            ></v-text-field>
            <v-row justify="end">
              <v-btn @click="addCategory" color="primary">Save</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions>
      <v-row justify="end" class="ma-2 pa-2">
        <v-btn v-if="!gif" @click="addGIF" color="primary">Submit</v-btn>
        <v-btn v-if="gif" @click="$emit('dialog-closed')">Close</v-btn>
        <v-btn v-if="gif" @click="addGIF" color="primary">Update</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import { firebaseDB } from '@/services/firebaseInit.js'
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
      error: false,
      errorMsg: null,
      loading: false,
      valid: null,
      activity: null,
      activities: [],
      category: null,
      categories: [],
      url: null,
      rules: {
        required: (value) => !!value || 'Required.'
      },
      showAddCategoryDialog: false,
      newCategory: null
    }
  },
  watch: {
    gif: {
      handler(newVal) {
        if (newVal) {
          this.url = newVal.url
          this.activity = newVal.activity
          this.category = newVal.category
        } else {
          this.url = null
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
    addGIF() {
      const vm = this
      vm.loading = true
      const payload = {
        url: vm.url,
        activity: vm.activity,
        category: vm.category
      }
      if (vm.gif) {
        firebaseDB
          .ref('gifs/' + vm.gif.uid)
          .update(payload)
          .then(() => {
            payload.uid = vm.gif.uid
            vm.$emit('gif-updated', payload)
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
          .ref('gifs')
          .push(payload)
          .then((added) => {
            payload.uid = added.key
            vm.$emit('gif-added', payload)
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
