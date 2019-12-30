<template>
  <v-card :disabled="loading">
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="quoteText"
              :rules="[rules.required]"
              hide-details
              label="Quote"
              outlined
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              :items="activities"
              v-model="activity"
              :rules="[rules.required]"
              hide-details
              label="Activity"
              outlined
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-right" cols="12">
            <v-btn
              @click="
                $emit('dialog-closed')
                $refs.form.reset()
              "
              >Close</v-btn
            >
            <v-btn v-if="!quote" @click="addQuote" color="primary"
              >Submit</v-btn
            >
            <v-btn v-if="quote" @click="addQuote" color="primary">Update</v-btn>
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
    </v-card-text>
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
      quoteText: null,
      rules: {
        required: (value) => !!value || 'Required.'
      }
    }
  },
  watch: {
    quote: {
      handler(newVal) {
        if (newVal) {
          this.quoteText = newVal.quote
          this.activity = newVal.activity
        } else {
          this.quoteText = null
          this.activity = null
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
  },
  methods: {
    addQuote() {
      const vm = this
      vm.loading = true
      const payload = {
        quote: vm.quoteText,
        activity: vm.activity
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
