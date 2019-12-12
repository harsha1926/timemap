const addUID = (context, uid) => {
  context.commit('UID_ADDED', uid)
}

const removeUID = (context) => {
  context.commit('UID_REMOVED')
}

const addEmail = (context, email) => {
  context.commit('EMAIL_ADDED', email)
}

const removeEmail = (context) => {
  context.commit('EMAIL_REMOVED')
}

const addDisplayName = (context, displayName) => {
  context.commit('DISPLAY_NAME_ADDED', displayName)
}

const removeDisplayName = (context) => {
  context.commit('DISPLAY_NAME_REMOVED')
}

const addPhotoURL = (context, photoURL) => {
  context.commit('PHOTO_URL_ADDED', photoURL)
}

const removePhotoURL = (context) => {
  context.commit('PHOTO_URL_REMOVED')
}

const addUser = (context, payload) => {
  addUID(context, payload.uid)
  addEmail(context, payload.email)
  addDisplayName(context, payload.displayName)
  addPhotoURL(context, payload.photoURL)
}

const removeUser = (context) => {
  removeUID(context)
  removeEmail(context)
  removeDisplayName(context)
  removePhotoURL(context)
  context.dispatch('phone/removePhone')
  context.dispatch('currentLocation/removeCurrentLocation')
}

export default {
  addUID,
  removeUID,
  addEmail,
  removeEmail,
  addDisplayName,
  removeDisplayName,
  addPhotoURL,
  removePhotoURL,
  addUser,
  removeUser
}
