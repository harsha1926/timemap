import Vuex from 'vuex'
import userModule from './modules/user'
import friendsModule from './modules/friends'

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      user: userModule,
      friends: friendsModule
    }
  })
}

export default createStore
