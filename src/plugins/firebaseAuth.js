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
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber
              })
              .then(() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      firebaseDB
                        .ref('users')
                        .child(user.uid)
                        .update({
                          currentLocation: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          }
                        })
                      store.dispatch(
                        'user/currentLocation/addCurrentLocation',
                        {
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        }
                      )
                    },
                    (error) => {
                      console.error(error)
                    },
                    { timeout: 10000 }
                  )
                }
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
              .then(() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      firebaseDB
                        .ref('users')
                        .child(user.uid)
                        .update({
                          currentLocation: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          }
                        })
                      store.dispatch(
                        'user/currentLocation/addCurrentLocation',
                        {
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        }
                      )
                    },
                    (error) => {
                      console.error(error)
                    },
                    { timeout: 10000 }
                  )
                }
              })
          }
        })

        return resolve(
          store.dispatch('user/addUser', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber
          })
        )
      }
      return resolve()
    })
  })
}
