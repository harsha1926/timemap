export default {
  mode: 'spa',
  generate: {
    dir: '../public'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    title: 'TimeMap',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: 'theme-color',
        content: '#e67e22'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Turret+Road|Lexend+Mega&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loadingIndicator: {
    name: 'folding-cube',
    color: '#e67e22',
    background: 'white'
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/global.js',
    '~/plugins/firebaseAuth.js',
    '~/plugins/vuetify.js',
    '~/plugins/mask.js',
    '~/plugins/telephoneInput.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#e67e22'
        }
      }
    }
  },
  pwa: {
    manifest: {
      name: 'TIMEMAP',
      short_name: 'TIMEMAP',
      lang: 'en',
      display: 'standalone'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
