const addCountryCode = (context, countryCode) => {
  context.commit('COUNTRY_CODE_ADDED', countryCode)
}

const removeCountryCode = (context) => {
  context.commit('COUNTRY_CODE_REMOVED')
}

const addCallingCode = (context, callingCode) => {
  context.commit('CALLING_CODE_ADDED', callingCode)
}

const removeCallingCode = (context) => {
  context.commit('CALLING_CODE_REMOVED')
}

const addPhoneNumber = (context, phoneNumber) => {
  context.commit('PHONE_NUMBER_ADDED', phoneNumber)
}

const removePhoneNumber = (context) => {
  context.commit('PHONE_NUMBER_REMOVED')
}

const addPhone = (context, payload) => {
  addCountryCode(context, payload.countryCode)
  addCallingCode(context, payload.callingCode)
  addPhoneNumber(context, payload.phoneNumber)
}

const removePhone = (context) => {
  removeCountryCode(context)
  removeCallingCode(context)
  removePhoneNumber(context)
}

export default {
  addCountryCode,
  removeCountryCode,
  addCallingCode,
  removeCallingCode,
  addPhoneNumber,
  removePhoneNumber,
  addPhone,
  removePhone
}
