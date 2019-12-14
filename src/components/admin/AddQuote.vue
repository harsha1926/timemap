<template>
  <v-row align="center" justify="center">
    <v-card :disabled="loading" max-width="600">
      <v-card-title>Add Quote</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="quote"
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
          >Quote added successfully..</v-row
        >
        <v-row
          v-if="error"
          align="center"
          justify="center"
          class="overline error--text ma-2 pa-2"
          >{{ errorMsg }}</v-row
        >
      </v-card-text>
      <v-card-actions>
        <v-row justify="end" class="ma-2 pa-2">
          <v-btn @click="addQuote" color="primary">SUBMIT</v-btn>
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
      activities: ['free'],
      category: null,
      categories: [],
      quote: null,
      rules: {
        required: (value) => !!value || 'Required.'
      }
    }
  },
  mounted() {
    const vm = this
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
  },
  methods: {
    addQuote() {
      const vm = this
      vm.loading = true
      firebase
        .database()
        .ref('quotes')
        .push({
          quote: vm.quote,
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
  }
}
</script>
