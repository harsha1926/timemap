import Vue from 'vue'

export default () => {
  Vue.directive('uppercase', {
    bind(el, _, vnode) {
      el.addEventListener('keyup', (e) => {
        e.target.value = e.target.value.toUpperCase()
        vnode.componentInstance.$emit('input', e.target.value.toUpperCase())
      })
    }
  })
}
