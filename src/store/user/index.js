import actions from './actions'
import getters from './getters'
import mutations from './mutations'
export const state = () => ({
  uid: null,
  email: null,
  displayName: null,
  photoURL: null
})

export default {
  state,
  actions,
  getters,
  mutations
}
