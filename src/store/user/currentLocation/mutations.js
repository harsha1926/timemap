const LATITUDE_ADDED = (state, latitude) => {
  state.latitude = latitude
}

const LATITUDE_REMOVED = (state) => {
  state.latitude = null
}

const LONGITUDE_ADDED = (state, longitude) => {
  state.longitude = longitude
}

const LONGITUDE_REMOVED = (state) => {
  state.longitude = null
}

export default {
  LATITUDE_ADDED,
  LATITUDE_REMOVED,
  LONGITUDE_ADDED,
  LONGITUDE_REMOVED
}
