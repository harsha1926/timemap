import { getDefaultState } from './defaultState'

const USER_STORE_STATE_RESET = (state) => {
  Object.assign(state, getDefaultState())
}

const USER_UPDATED = (state, user) => {
  state.user = user
}

export default {
  USER_STORE_STATE_RESET,
  USER_UPDATED
}
