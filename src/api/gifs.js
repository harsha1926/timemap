import axios from 'axios'
import { tenorAPIKey } from '~/plugins/apiKeys'

const fetchRandomGIF = (search) => {
  return axios.get(
    `https://api.tenor.com/v1/random?contentfilter=high&ar_range=wide&limit=1&q=${search}&key=${tenorAPIKey}`
  )
}

const fetchRandomGIFs = (search, limit) => {
  return axios.get(
    `https://api.tenor.com/v1/random?contentfilter=high&ar_range=wide&limit=${limit}&q=${search}&key=${tenorAPIKey}`
  )
}

const fetchGIFs = (search, limit) => {
  return axios.get(
    `https://api.tenor.com/v1/search?contentfilter=high&ar_range=wide&limit=${limit}&q=${search}&key=${tenorAPIKey}`
  )
}

export { fetchRandomGIF, fetchRandomGIFs, fetchGIFs }
