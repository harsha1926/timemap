import firebase from 'firebase'
export default function({ store, redirect }) {
  if (process.browser) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        // No user is signed in.
        return redirect('/login')
      } else {
        store.commit('user/USER_UPDATED', user)
      }
    })
  }
}
