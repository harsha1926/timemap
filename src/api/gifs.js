import axios from 'axios'
import { tenorAPIKey } from '~/plugins/apiKeys'

const fetchRandomGIFs = (search, limit) => {
  return axios.get(
    `https://api.tenor.com/v1/random?contentfilter=high&ar_range=wide&limit=${limit}&q=${search}&key=${tenorAPIKey}`
  )
}

export { fetchRandomGIFs }
