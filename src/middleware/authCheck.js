export default function({ store, redirect }) {
  if (process.browser) {
    if (!store.getters['user/user']) {
      return redirect('/login')
    }
  }
}
