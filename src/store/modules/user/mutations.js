const USER_ADDED = (state, user) => {
  state.user = user
}

const USER_REMOVED = (state) => {
  state.user = null
}

const PHONE_NUMBER_ADDED = (state, payload) => {
  if (state.user) {
    state.user.countryCode = payload.countryCode
    state.user.phoneNumber = payload.phoneNumber
  }
}

export default {
  USER_ADDED,
  USER_REMOVED,
  PHONE_NUMBER_ADDED
}
