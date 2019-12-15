import actions from './actions'
import getters from './getters'
import mutations from './mutations'
export const state = () => ({
  latitude: null,
  longitude: null
})
export default {
  state,
  actions,
  getters,
  mutations
}
