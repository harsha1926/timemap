import Vue from 'vue'
import { firebaseDB } from '@/services/firebaseInit.js'
import { fetchTimezone } from '@/api/timezone'

export default () => {
  Vue.directive('uppercase', {
    bind(el, _, vnode) {
      el.addEventListener('keyup', (e) => {
        e.target.value = e.target.value.toUpperCase()
        vnode.componentInstance.$emit('input', e.target.value.toUpperCase())
      })
    }
  })
  Vue.mixin({
    methods: {
      encodeEmail(email) {
        return email.replace(/[^a-zA-Z ]/g, '')
      },
      getUserCurrentLocation(uid) {
        if (navigator.geolocation && uid) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              fetchTimezone(
                position.coords.latitude,
                position.coords.longitude,
                Date.now() / 1000
              ).then((res) => {
                firebaseDB
                  .ref('users')
                  .child(uid)
                  .update({
                    currentLocation: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      timezone: res.data.timeZoneId,
                      lastUpdated: new Date()
                    }
                  })
              })

              this.$store.dispatch('user/currentLocation/addCurrentLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              })
            },
            (error) => {
              // eslint-disable-next-line
              console.error(error)
            },
            { timeout: 10000 }
          )
        }
      },
      addUser(user) {
        const vm = this
        firebaseDB.ref('users/' + user.uid).once('value', function (data) {
          if (data.val() && data.val().uid) {
            vm.addUserToStore(data.val())
          } else {
            vm.addUserToDatabase(user)
            vm.addUserToStore(user)
          }
        })
      },
      addUserToStore(user) {
        this.$store.dispatch('user/addUser', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          allowContact: user.allowContact
        })
      },
      addUserToDatabase(user) {
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
    }
  })
}
