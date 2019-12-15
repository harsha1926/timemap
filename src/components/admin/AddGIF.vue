<template>
  <v-row align="center" justify="center">
    <v-card :disabled="loading" max-width="600">
      <v-card-title>Add GIF</v-card-title>
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
          <v-autocomplete
            :items="categories"
            v-model="category"
            :rules="[rules.required]"
            label="Category"
            outlined
            clearable
          ></v-autocomplete>
        </v-form>
        <v-row
          v-if="success"
          align="center"
          justify="center"
          class="overline primary--text ma-2 pa-2"
        >
          GIF added successfully..
        </v-row>
        <v-row
          v-if="error"
          align="center"
          justify="center"
          class="overline error--text ma-2 pa-2"
        >
          {{ errorMsg }}
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row justify="end" class="ma-2 pa-2">
          <v-btn @click="addGIF" color="primary">SUBMIT</v-btn>
        </v-row>
      </v-card-actions>
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
      }
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
