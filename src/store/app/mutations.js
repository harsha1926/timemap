const PREVIOUS_PAGE_UPDATED = (state, url) => {
  state.previousPage = url
}

const CURRENT_PAGE_UPDATED = (state, url) => {
  state.currentPage = url
}

export default {
  PREVIOUS_PAGE_UPDATED,
  CURRENT_PAGE_UPDATED
}
