import axios from 'axios'
import { apiKey } from '@/services/firebaseInit'

const fetchTimezone = (latitude, longitude, timestamp) => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`
  )
}

export { fetchTimezone }
