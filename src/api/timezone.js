import axios from 'axios'

const fetchTimezone = (latitude, longitude, timestamp) => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=AIzaSyAy3NsjnLLa6xRIRbWMXjvHq_0jMZO0YTY`
  )
}

export { fetchTimezone }
