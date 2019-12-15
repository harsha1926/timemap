import { auth, firebaseDB } from '@/services/firebaseInit.js'
export default (context) => {
  const { store } = context
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firebaseDB.ref('users/' + user.uid).once('value', function(data) {
          if (data.val() && data.val().uid) {
            firebaseDB
              .ref('users')
              .child(user.uid)
              .update({
                displayName: user.displayName,
                nameLowerCase: user.displayName.toLowerCase(),
                photoURL: user.photoURL
              })
            if (data.val().phone)
              store.dispatch('user/phone/addPhone', data.val().phone)
          } else {
            firebaseDB
              .ref('users')
              .child(user.uid)
              .set({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                nameLowerCase: user.displayName.toLowerCase(),
                photoURL: user.photoURL
              })
          }
        })

        return resolve(
          store.dispatch('user/addUser', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        )
      }
      return resolve()
    })
  })
}
