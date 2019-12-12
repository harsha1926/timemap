const addLatitude = (context, latitude) => {
  context.commit('LATITUDE_ADDED', latitude)
}

const removeLatitude = (context) => {
  context.commit('LATITUDE_REMOVED')
}

const addLongitude = (context, longitude) => {
  context.commit('LONGITUDE_ADDED', longitude)
}

const removeLongitude = (context) => {
  context.commit('LONGITUDE_REMOVED')
}

const addCurrentLocation = (context, payload) => {
  addLatitude(context, payload.latitude)
  addLongitude(context, payload.longitude)
}

const removeCurrentLocation = (context) => {
  removeLatitude(context)
  removeLongitude(context)
}

export default {
  addLatitude,
  removeLatitude,
  addLongitude,
  removeLongitude,
  addCurrentLocation,
  removeCurrentLocation
}
