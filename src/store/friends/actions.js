const addFriend = (context, friend) => {
  context.commit('FRIEND_ADDED', friend)
}

const removeFriend = (context, friend) => {
  context.commit('FRIEND_REMOVED', friend)
}

const updateFriendsList = (context, friends) => {
  context.commit('FRIENDS_LIST_UPDATED', friends)
}

const clearFriendsList = (context) => {
  context.commit('FRIENDS_LIST_CLEARED')
}

export default {
  addFriend,
  removeFriend,
  updateFriendsList,
  clearFriendsList
}
