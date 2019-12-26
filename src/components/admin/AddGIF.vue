<template>
  <v-row align="center" justify="center">
    <v-card max-width="400">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-row>
                <v-col cols="4">Add GIF</v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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
                      <v-btn text color="primary" @click="openAddCategoryDialog">Add</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
                <v-row
                  v-if="success"
                  align="center"
                  justify="center"
                  class="overline primary--text ma-2 pa-2"
                >GIF added successfully..</v-row>
                <v-row
                  v-if="error"
                  align="center"
                  justify="center"
                  class="overline error--text ma-2 pa-2"
                >{{ errorMsg }}</v-row>
              </v-card-text>
              <v-card-actions>
                <v-row justify="end" class="ma-2 pa-2">
                  <v-btn @click="addGIF" color="primary">Submit</v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

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

      <v-card>
        <v-data-table :headers="headers" :items="gifs">
          <template v-slot:item.url="{ item }">
            <v-avatar>
              <v-img
                :src="item.url"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
              ></v-img>
            </v-avatar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" fab icon x-small>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="primary" fab icon x-small>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </v-row>
</template>
<script>
import { firebaseDB } from '@/services/firebaseInit.js'
export default {
  data() {
    return {
      error: false,
      errorMsg: null,
      success: false,
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
      newCategory: null,
      headers: [
        { text: 'Activity', value: 'activity' },
        { text: 'Category', value: 'category' },
        { text: 'Preview', value: 'url' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      gifs: []
    }
  },
  watch: {
    url() {
      this.success = false
    }
  },
  mounted() {
    const vm = this
    firebaseDB.ref('gifs').once('value', function(snapshot) {
      snapshot.forEach((data) => {
        vm.gifs.push({
          url: data.val().url,
          activity: data.val().activity,
          category: data.val().category,
          uid: data.key
        })
      })
    })
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
      firebaseDB
        .ref('gifs')
        .push(payload)
        .then(() => {
          vm.success = true
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
</script>
