<template>
  <v-container fluid fill-height style="height: 70vh; max-height: 85%;">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card v-if="!confirmationResult">
          <v-card-title class="appLoginInfo">Verify your phone number</v-card-title>
          <v-card-text>
            <vue-tel-input ref="telInput" @validate="isValidPhone" :validCharactersOnly="true" 
              placeholder="Enter your phone number"
              :dropdownOptions="dropdownOptions"
              :preferredCountries="['CA', 'IN', 'US']"
              name="telInput"
            >
            </vue-tel-input>
          </v-card-text>
          <v-card-actions>
            <v-btn name="submitPhoneBtn" ref="signIn" :loading="loading" @click="submitPhoneNumberAuth()" :disabled="!validPhone || !phone" color="primary">GET VERIFICATION CODE</v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-else>
          <v-card-title class="appLoginInfo">Enter verfication code</v-card-title>
          <v-card-text>
            <pin-input @validate="isValidCode"></pin-input>
          </v-card-text>
          <v-card-actions>
            <v-btn name="submitCodeBtn" @click="submitPhoneNumberAuthCode()" :disabled="!validVerificationCode || !authCode" color="primary">LOGIN</v-btn>
          </v-card-actions>
        </v-card>  
        <v-row v-if="errorMessage" class="overline ma-2 pa-2 error--text" wrap>{{ errorMessage }}</v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import { mapGetters, mapActions } from 'vuex'
import PinInput from './PinInput'
import { auth, firebaseDB } from '@/services/firebaseInit.js'
export default {
  components: {
    PinInput
  },
  data: () => ({
    dropdownOptions: { disabledDialCode: true },
    loading: false,
    phone: null,
    errorMessage: null,
    validPhone: false,
    validVerificationCode: false,
    authCode: null,
    confirmationResult: null
  }),
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted() {
    const vm = this
    vm.$refs.telInput.focus()
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
    isValidPhone(isValid) {
      this.validPhone = isValid.valid
      if (isValid.valid) {
        this.phone = isValid.number.e164
      }
    },
    isValidCode(isValid) {
      this.validVerificationCode = isValid.valid
      if (isValid.valid) {
        this.authCode = isValid.value
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
          vm.loading = false
        })
        .catch(function(error) {
          console.error(error)
        })
    },
    submitPhoneNumberAuthCode() {
      const vm = this
      vm.confirmationResult
        .confirm(vm.authCode)
        .then(function(result) {
          firebaseDB.ref('users/' + vm.uid).update({
            phoneNumber: vm.phone
          })
          vm.addPhoneNumber(vm.phone)
        })
        .catch(function(error) {
          console.error(error)
          vm.errorMessage = error.message
        })
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
  font-size: 16px;
  font-family: 'Lexend Mega', sans-serif;
}
</style>
