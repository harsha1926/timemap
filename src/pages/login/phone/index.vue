<template>
  <v-app id="timeMapNoNav">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="start" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title class="appLoginHeading mb-5"
                >Sign in with phone</v-card-title
              >
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-autocomplete
                    :items="countries"
                    v-model="country"
                    :rules="[rules.required]"
                    label="Country"
                    outlined
                    return-object
                    item-text="name"
                    item-value="alpha2Code"
                  ></v-autocomplete>

                  <v-text-field
                    v-mask="'(###)-###-####'"
                    v-model="phoneMasked"
                    :rules="[rules.required, rules.phoneNumber]"
                    label="Phone"
                    outlined
                  ></v-text-field>
                  <v-btn
                    id="signIn"
                    ref="signIn"
                    @click="submitPhoneNumberAuth()"
                    :disabled="!valid"
                    color="primary"
                    >GET VERIFICATION CODE</v-btn
                  >
                </v-form>
                <v-row
                  v-if="confirmationResult"
                  class="overline mt-1 ml-1 pt-3 pl-3 pr-3 primary--text"
                  justify="center"
                >
                  Verification code sent successfully! Please enter the code to
                  proceed..
                </v-row>
                <v-form
                  ref="verificationCodeForm"
                  v-model="validVerificationCode"
                  lazy-validation
                >
                  <v-text-field
                    v-model="authCode"
                    :rules="[rules.verificationCode]"
                    :error="!confirmationResult"
                    class="mt-8"
                    label="Verification Code"
                    outlined
                  ></v-text-field>
                  <v-btn
                    @click="submitPhoneNumberAuthCode()"
                    :disabled="!validVerificationCode"
                    color="primary"
                    >LOGIN</v-btn
                  >
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
export default {
  data: () => ({
    valid: false,
    validVerificationCode: false,
    rules: {
      required: (value) => !!value || 'Required.',
      phoneNumber: (value) =>
        (!!value && value.length === 14) || 'Invalid phone number.',
      verificationCode: (value) =>
        (!!value && value.length === 6) || 'Invalid verification code.'
    },
    country: null,
    phoneMasked: null,
    authCode: null,
    confirmationResult: null,
    countries: []
  }),
  layout: 'noNav',
  computed: {
    phone() {
      return this.phoneMasked ? this.phoneMasked.replace(/\D+/g, '') : null
    }
  },
  mounted() {
    const vm = this
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      vm.countries = response.data
    })
    vm.$nextTick(() => {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        vm.$refs.signIn.$el,
        {
          size: 'invisible',
          callback(response) {
            vm.submitPhoneNumberAuth()
          }
        }
      )
    })
  },
  methods: {
    submitPhoneNumberAuth() {
      if (this.$refs.form.validate()) {
        const vm = this
        const appVerifier = window.recaptchaVerifier
        firebase
          .auth()
          .signInWithPhoneNumber(
            '+' + vm.country.callingCodes[0] + vm.phone,
            appVerifier
          )
          .then(function(confirmationResult) {
            vm.confirmationResult = confirmationResult
          })
          .catch(function(error) {
            /* eslint-disable no-console */
            console.error(error)
          })
      }
    },
    submitPhoneNumberAuthCode() {
      if (this.$refs.verificationCodeForm.validate()) {
        const vm = this
        vm.confirmationResult
          .confirm(vm.authCode)
          .then(function(result) {
            vm.$router.push('/')
          })
          .catch(function(error) {
            /* eslint-disable no-console */
            console.error(error)
          })
      }
    }
  }
}
</script>
<style scoped>
.appLoginHeading {
  font-size: 20px;
  font-family: 'Lexend Mega', sans-serif;
}
.appLoginInfo {
  font-family: 'Lexend Mega', sans-serif;
}
</style>
