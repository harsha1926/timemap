const USER_ADDED = (state, user) => {
  state.user = user
}

const USER_REMOVED = (state) => {
  state.user = null
}

const PHONE_NUMBER_ADDED = (state, phoneNumber) => {
  if (state.user) state.user.phoneNumber = phoneNumber
}

export default {
  USER_ADDED,
  USER_REMOVED,
  PHONE_NUMBER_ADDED
}
