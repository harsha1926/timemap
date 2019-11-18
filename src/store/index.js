import Vuex from 'vuex'
import userModule from './modules/user'

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      user: userModule
    }
  })
}

export default createStore
