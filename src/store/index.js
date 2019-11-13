import Vuex from 'vuex'
import userModule from './modules/user'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      user: userModule
    }
  })
}

export default createStore
