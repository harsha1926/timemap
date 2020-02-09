const updatePreviousPage = (context, url) => {
  context.commit('PREVIOUS_PAGE_UPDATED', url)
}

const updateCurrentPage = (context, url) => {
  context.commit('CURRENT_PAGE_UPDATED', url)
}

export default {
  updatePreviousPage,
  updateCurrentPage
}
