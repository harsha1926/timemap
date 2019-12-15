import actions from './actions'
import getters from './getters'
import mutations from './mutations'
export const state = () => ({
  countryCode: null,
  callingCode: null,
  phoneNumber: null
})
export default {
  state,
  actions,
  getters,
  mutations
}
