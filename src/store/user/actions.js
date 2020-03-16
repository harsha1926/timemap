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

const addPhoneNumber = (context, phoneNumber) => {
  context.commit('PHONE_NUMBER_ADDED', phoneNumber)
}

const removePhoneNumber = (context) => {
  context.commit('PHONE_NUMBER_REMOVED')
}

const addAllowContact = (context, allowContact) => {
  context.commit('ALLOW_CONTACT_UPDATED', allowContact)
}

const removeAllowContact = (context) => {
  context.commit('ALLOW_CONTACT_UPDATED', false)
}

const addUser = (context, payload) => {
  addUID(context, payload.uid)
  addEmail(context, payload.email)
  addDisplayName(context, payload.displayName)
  addPhotoURL(context, payload.photoURL)
  addPhoneNumber(context, payload.phoneNumber)
  addAllowContact(context, payload.allowContact)
}

const removeUser = (context) => {
  removeUID(context)
  removeEmail(context)
  removeDisplayName(context)
  removePhotoURL(context)
  removePhoneNumber(context)
  removeAllowContact(context)
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
  removeUser,
  addPhoneNumber,
  removePhoneNumber,
  addAllowContact,
  removeAllowContact
}
