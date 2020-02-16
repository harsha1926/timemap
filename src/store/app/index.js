import actions from './actions'
import getters from './getters'
import mutations from './mutations'
export const state = () => ({
  previousPage: null,
  currentPage: null,
  loginError: null
})
export default {
  state,
  actions,
  getters,
  mutations
}
