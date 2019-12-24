<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1"></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2"></v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card>
              <v-card-text>
                <vue-tel-input
                  @validate="isValid"
                  :enabledCountryCode="true"
                  :validCharactersOnly="true"
                ></vue-tel-input>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :loading="loading"
                  ref="signIn"
                  @click="submitPhoneNumberAuth()"
                  :disabled="!valid"
                  color="primary"
                >GET VERIFICATION CODE</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-text-field
              v-model="authCode"
              :rules="[rules.verificationCode]"
              label="Verification Code"
              outlined
            ></v-text-field>
            <div class="input-wrapper">
              <PincodeInput v-model="code" placeholder="0" :length="6" />
            </div>
            <v-btn
              @click="submitPhoneNumberAuthCode()"
              :disabled="!validVerificationCode || !valid || !confirmationResult"
              color="primary"
            >LOGIN</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-row v-if="errorMessage" class="overline ma-2 pa-2 error--text" wrap>{{ errorMessage }}</v-row>
    </v-col>
  </v-row>
</template>

<script>
import * as firebase from 'firebase/app'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import { auth, firebaseDB } from '@/services/firebaseInit.js'
export default {
  data: () => ({
    loading: false,
    phone: null,
    step: 1,
    errorMessage: null,
    valid: false,
    validVerificationCode: false,
    rules: {
      verificationCode: (value) =>
        (!!value && value.length === 6) || 'Invalid verification code.'
    },
    country: null,
    phoneMasked: null,
    authCode: null,
    confirmationResult: null,
    countries: []
  }),
  computed: {
    ...mapGetters('user', ['uid'])
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
    ...mapActions('user', ['addPhoneNumber']),
    isValid(isValid) {
      this.valid = isValid.valid
      if (isValid.valid) {
        this.phone = isValid.number.e164
      }
    },
    submitPhoneNumberAuth() {
      const vm = this
      vm.loading = true
      const appVerifier = window.recaptchaVerifier
      auth.currentUser
        .linkWithPhoneNumber(vm.phone, appVerifier)
        .then(function(confirmationResult) {
          vm.confirmationResult = confirmationResult
          vm.step = 2
          vm.loading = false
        })
        .catch(function(error) {
          console.error(error)
        })
    },
    submitPhoneNumberAuthCode() {
      if (this.$refs.verificationCodeForm.validate()) {
        const vm = this
        vm.confirmationResult
          .confirm(vm.authCode)
          .then(function(result) {
            firebaseDB.ref('users/' + vm.uid).update({
              phoneNumber: '+' + vm.country.callingCodes[0] + vm.phone
            })
            vm.addPhoneNumber('+' + vm.country.callingCodes[0] + vm.phone)
          })
          .catch(function(error) {
            console.error(error)
            vm.errorMessage = error.message
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
