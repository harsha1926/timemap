<template>
  <v-row align="center" justify="center">
    <v-card class="elevation-12" width="400">
      <v-card-title class="appLoginHeading mb-5">Verify phone</v-card-title>
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
            clearable
          >
            <template v-slot:item="data">
              <v-row align="center" class="ma-2">
                <v-flex>
                  <v-avatar tile size="30" class="mr-2">
                    <v-img
                      :src="
                        'https://www.countryflags.io/' +
                          data.item.alpha2Code +
                          '/shiny/64.png'
                      "
                    ></v-img>
                  </v-avatar>
                  {{ data.item.name }}
                </v-flex>
              </v-row>
            </template>
            <template v-slot:selection="data">
              <v-row align="center" class="ma-2">
                <v-flex>
                  <v-avatar tile size="30" class="mr-2">
                    <v-img
                      :src="
                        'https://www.countryflags.io/' +
                          data.item.alpha2Code +
                          '/shiny/64.png'
                      "
                    ></v-img>
                  </v-avatar>
                  {{ data.item.name }}
                </v-flex>
              </v-row>
            </template>
          </v-autocomplete>

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
        <v-form ref="verificationCodeForm" v-model="validVerificationCode">
          <v-text-field
            v-model="authCode"
            :rules="[rules.verificationCode]"
            class="mt-8"
            label="Verification Code"
            outlined
          ></v-text-field>
          <v-btn
            @click="submitPhoneNumberAuthCode()"
            :disabled="!validVerificationCode || !valid || !confirmationResult"
            color="primary"
            >LOGIN</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
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
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
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
    ...mapActions({
      addUserPhoneNumber: 'user/addPhoneNumber'
    }),
    submitPhoneNumberAuth() {
      if (this.$refs.form.validate()) {
        const vm = this
        const appVerifier = window.recaptchaVerifier
        firebase
          .auth()
          .currentUser.linkWithPhoneNumber(
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
            firebase
              .database()
              .ref('users/' + vm.user.uid)
              .update({
                phoneNumber: '+' + vm.country.callingCodes[0] + vm.phone
              })
            vm.addUserPhoneNumber('+' + vm.country.callingCodes[0] + vm.phone)
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
