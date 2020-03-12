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
      }
    }
  })
}
