const addUser = (context, user) => {
  context.commit('USER_ADDED', user)
}

const addPhoneNumber = (context, payload) => {
  context.commit('PHONE_NUMBER_ADDED', payload)
}

const clearUser = (context) => {
  context.commit('USER_REMOVED')
}

export default {
  addUser,
  clearUser,
  addPhoneNumber
}
