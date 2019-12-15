const UID_ADDED = (state, uid) => {
  state.uid = uid
}

const UID_REMOVED = (state) => {
  state.uid = null
}

const EMAIL_ADDED = (state, email) => {
  state.email = email
}

const EMAIL_REMOVED = (state) => {
  state.email = null
}

const DISPLAY_NAME_ADDED = (state, displayName) => {
  state.displayName = displayName
}

const DISPLAY_NAME_REMOVED = (state) => {
  state.displayName = null
}

const PHOTO_URL_ADDED = (state, photoURL) => {
  state.photoURL = photoURL
}

const PHOTO_URL_REMOVED = (state) => {
  state.photoURL = null
}

const PHONE_NUMBER_ADDED = (state, phoneNumber) => {
  state.phoneNumber = phoneNumber
}

const PHONE_NUMBER_REMOVED = (state) => {
  state.phoneNumber = null
}

export default {
  UID_ADDED,
  UID_REMOVED,
  EMAIL_ADDED,
  EMAIL_REMOVED,
  DISPLAY_NAME_ADDED,
  DISPLAY_NAME_REMOVED,
  PHOTO_URL_ADDED,
  PHOTO_URL_REMOVED,
  PHONE_NUMBER_ADDED,
  PHONE_NUMBER_REMOVED
}
