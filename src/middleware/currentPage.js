export default function({ store }) {
  store.app.router.beforeEach((to, from, next) => {
    store.dispatch('app/updatePreviousPage', from.path)
    store.dispatch('app/updateCurrentPage', to.path)
    next()
  })
}
