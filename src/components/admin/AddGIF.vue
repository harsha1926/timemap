<template>
  <v-row align="center" justify="center">
    <v-card max-width="600" :disabled="loading">
      <v-card-title>Add GIF</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field v-model="url" :rules="[rules.required]" label="URL" outlined clearable></v-text-field>
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
          <v-btn @click="addGIF" color="primary">SUBMIT</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script>
import firebase from 'firebase'
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
  methods: {
    addGIF() {
      let vm = this
      vm.loading = true
      firebase
        .database()
        .ref('gifs')
        .push({
          url: vm.url,
          activity: vm.activity,
          category: vm.category
        })
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
  },
  mounted: function() {
    let vm = this
    firebase
      .database()
      .ref('activities')
      .once('value', function(snapshot) {
        snapshot.forEach((data) => {
          vm.activities.push(data.key)
        })
      })
    firebase
      .database()
      .ref('categories')
      .once('value', function(snapshot) {
        snapshot.forEach((data) => {
          vm.categories.push(data.key)
        })
      })
  }
}
</script>