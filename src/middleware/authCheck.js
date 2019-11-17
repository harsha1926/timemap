import firebase from 'firebase'
export default function({ redirect }) {
  if (process.browser) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        // No user is signed in.
        return redirect('/login')
      }
    })
  }
}
