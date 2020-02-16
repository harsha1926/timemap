const PREVIOUS_PAGE_UPDATED = (state, url) => {
  state.previousPage = url
}

const CURRENT_PAGE_UPDATED = (state, url) => {
  state.currentPage = url
}

const LOGIN_ERROR_UPDATED = (state, error) => {
  state.loginError = error
}

export default {
  PREVIOUS_PAGE_UPDATED,
  CURRENT_PAGE_UPDATED,
  LOGIN_ERROR_UPDATED
}
