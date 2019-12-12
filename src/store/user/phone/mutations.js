const COUNTRY_CODE_ADDED = (state, countryCode) => {
  state.countryCode = countryCode
}

const COUNTRY_CODE_REMOVED = (state) => {
  state.countryCode = null
}

const CALLING_CODE_ADDED = (state, callingCode) => {
  state.callingCode = callingCode
}

const CALLING_CODE_REMOVED = (state) => {
  state.callingCode = null
}

const PHONE_NUMBER_ADDED = (state, phoneNumber) => {
  state.phoneNumber = phoneNumber
}

const PHONE_NUMBER_REMOVED = (state) => {
  state.phoneNumber = null
}

export default {
  COUNTRY_CODE_ADDED,
  COUNTRY_CODE_REMOVED,
  CALLING_CODE_ADDED,
  CALLING_CODE_REMOVED,
  PHONE_NUMBER_ADDED,
  PHONE_NUMBER_REMOVED
}
