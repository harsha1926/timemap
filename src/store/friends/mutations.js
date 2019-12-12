const FRIEND_ADDED = (state, friend) => {
  state.friends.push(friend)
}

const FRIEND_REMOVED = (state, friend) => {
  const index = state.friends.findIndex((each) => {
    return each.email === friend.email
  })
  state.friends.splice(index, 1)
}

const FRIENDS_LIST_UPDATED = (state, friends) => {
  state.friends = friends
}

const FRIENDS_LIST_CLEARED = (state) => {
  state.friends = []
}

export default {
  FRIEND_ADDED,
  FRIEND_REMOVED,
  FRIENDS_LIST_UPDATED,
  FRIENDS_LIST_CLEARED
}
