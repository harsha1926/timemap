import { auth, firebaseDB, loginProviders } from '@/services/firebaseInit.js'

export default (context) => {
  const { store } = context
  const addUserToStore = (user) => {
    store.dispatch('user/addUser', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber
    })
  }

  const addUserToDatabase = (user) => {
    firebaseDB
      .ref('users')
      .child(user.uid)
      .set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
      })
  }

  auth.getRedirectResult().then(
    (result) => {
      const user = result.user
      if (user) {
        firebaseDB.ref('users/' + user.uid).once('value', function(data) {
          if (data.val() && data.val().uid) {
            addUserToStore(data.val())
          } else {
            addUserToDatabase(user)
            addUserToStore(user)
          }
        })
      }
    },
    (error) => {
      // eslint-disable-next-line
      console.error(error)
      const email = error.email
      if (error.code === 'auth/account-exists-with-different-credential') {
        auth.fetchSignInMethodsForEmail(email).then((providers) => {
          if (providers && providers.length) {
            const linkedProvider = loginProviders.find(
              (o) => o.providerId === providers[0]
            )
            auth
              .signInWithPopup(
                linkedProvider.setCustomParameters({ login_hint: email })
              )
              .then(
                (result) => {
                  const user = result.user
                  user.linkWithCredential(error.credential)
                  addUserToStore(user)
                },
                (err) => {
                  store.commit('app/LOGIN_ERROR_UPDATED', err.message)
                }
              )
          } else {
            store.commit('app/LOGIN_ERROR_UPDATED', error.message)
          }
        })
      } else {
        store.commit('app/LOGIN_ERROR_UPDATED', error.message)
      }
    }
  )

  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firebaseDB.ref('users/' + user.uid).once('value', function(data) {
          if (data.val() && data.val().uid) {
            addUserToStore(data.val())
            resolve()
          } else {
            addUserToDatabase(user)
            addUserToStore(user)
            resolve()
          }
        })
      }
    })
  })
}
