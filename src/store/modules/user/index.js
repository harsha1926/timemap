import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { getDefaultState } from './defaultState'

const state = getDefaultState()

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
