const addUser = (context, user) => {
  context.commit('USER_ADDED', user)
}

const addPhoneNumber = (context, phoneNumber) => {
  context.commit('PHONE_NUMBER_ADDED', phoneNumber)
}

const clearUser = (context) => {
  context.commit('USER_REMOVED')
}

export default {
  addUser,
  clearUser,
  addPhoneNumber
}
