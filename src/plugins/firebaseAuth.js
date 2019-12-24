import { auth, firebaseDB } from '@/services/firebaseInit.js'
export default (context) => {
  const { store } = context
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firebaseDB.ref('users/' + user.uid).once('value', function(data) {
          if (data.val() && data.val().uid) {
            store.dispatch('user/addUser', {
              uid: data.val().uid,
              email: data.val().email,
              displayName: data.val().displayName,
              photoURL: data.val().photoURL,
              phoneNumber: data.val().phoneNumber
            })
          } else {
            firebaseDB
              .ref('users')
              .child(user.uid)
              .set({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                nameLowerCase: user.displayName.toLowerCase(),
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber
              })
            store.dispatch('user/addUser', {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber
            })
          }
        })
      }
      return resolve()
    })
  })
}
