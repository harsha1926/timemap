import axios from 'axios'
import { tenorAPIKey } from '~/plugins/apiKeys'

const fetchRandomGIF = (search) => {
  return axios.get(
    `http://api.tenor.com/v1/random?media_filter=minimal&contentfilter=medium&ar_range=wide&limit=1&q=${search}&key=${tenorAPIKey}`
  )
}

export { fetchRandomGIF }
