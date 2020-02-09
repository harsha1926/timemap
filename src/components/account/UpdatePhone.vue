<template>
  <v-container fluid fill-height style="height: 70vh; max-height: 85%;">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card v-if="!verificationId">
          <v-card-title>Change your phone number</v-card-title>
          <v-card-text>
            <vue-tel-input
              ref="telInput"
              @validate="isValidPhone"
              :validCharactersOnly="true"
              :dropdownOptions="dropdownOptions"
              :preferredCountries="['CA', 'IN', 'US']"
              placeholder="Enter your new phone number"
              name="telInput"
            ></vue-tel-input>
          </v-card-text>
          <v-card-actions>
            <v-row justify="end" class="mr-5 mb-2">
              <v-btn
                ref="signIn"
                :loading="loading"
                @click="getVerificationCode()"
                :disabled="!validPhone || !phone"
                name="submitPhoneBtn"
                color="primary"
                >GET VERIFICATION CODE</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-card>

        <v-card v-else>
          <v-card-title>Enter verfication code</v-card-title>
          <v-card-text>
            <pin-input @validate="isValidCode"></pin-input>
          </v-card-text>
          <v-card-actions>
            <v-row justify="end" class="mr-5 mb-2">
              <v-btn @click="navigateToDashboard" name="canceBtn">Cancel</v-btn>
              <v-btn
                @click="submitVerficationCode()"
                :disabled="!validVerificationCode || !authCode"
                name="submitCodeBtn"
                color="primary"
                >Save</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-card>
        <v-row
          v-if="errorMessage"
          class="overline ma-2 pa-2 error--text"
          wrap
          >{{ errorMessage }}</v-row
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import { mapGetters, mapActions } from 'vuex'
import PinInput from '~/components/common/PinInput'
import { auth, firebaseDB, PhoneProvider } from '@/services/firebaseInit.js'
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
    verificationId: null
  }),
  computed: {
    ...mapGetters('user', ['uid'])
  },
  mounted() {
    const vm = this
    vm.$nextTick(() => {
      vm.$refs.telInput.focus()
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        vm.$refs.signIn.$el,
        {
          size: 'invisible'
        }
      )
    })
  },
  methods: {
    ...mapActions('user', ['addPhoneNumber']),
    navigateToDashboard() {
      this.$router.push('/')
    },
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
    getVerificationCode() {
      const vm = this
      vm.loading = true
      const appVerifier = window.recaptchaVerifier
      PhoneProvider.verifyPhoneNumber(vm.phone, appVerifier).then(function(
        verificationId
      ) {
        vm.verificationId = verificationId
        vm.loading = false
      })
    },
    submitVerficationCode() {
      const vm = this
      const cred = firebase.auth.PhoneAuthProvider.credential(
        vm.verificationId,
        vm.authCode
      )
      auth.currentUser
        .updatePhoneNumber(cred)
        .then(function(result) {
          firebaseDB.ref('users/' + vm.uid).update({
            phoneNumber: vm.phone
          })
          vm.addPhoneNumber(vm.phone)
          vm.navigateToDashboard()
        })
        .catch(function(error) {
          vm.errorMessage = error.message
        })
    }
  }
}
</script>
