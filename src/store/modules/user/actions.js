const addUser = (context, user) => {
  context.commit('USER_ADDED', user)
}

const clearUser = (context) => {
  context.commit('USER_REMOVED')
}

export default {
  addUser,
  clearUser
}
