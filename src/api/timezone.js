import axios from 'axios'
import { firebaseAPIKey } from '~/plugins/apiKeys'

const fetchTimezone = (latitude, longitude, timestamp) => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${firebaseAPIKey}`
  )
}

export { fetchTimezone }
