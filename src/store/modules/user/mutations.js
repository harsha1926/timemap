const USER_ADDED = (state, user) => {
  state.user = user
}

const USER_REMOVED = (state) => {
  state.user = null
}

export default {
  USER_ADDED,
  USER_REMOVED
}
