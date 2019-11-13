import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages: {
      en: require('~/locales/en.json')
    }
  })

  Object.defineProperty(Vue.prototype, '$locale', {
    get() {
      return app.i18n.locale
    },
    set(locale) {
      app.i18n.locale = locale
    }
  })

  Vue.filter('translate', function(value) {
    return app.i18n.t(value)
  })
}
