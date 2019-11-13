<template>
  <v-app id="stockapp">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Stock</v-toolbar-title>
      <v-row @click="logout" justify="end">
        <v-btn fab icon>
          <v-icon>fa-sign-out-alt</v-icon>
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt></nuxt>
      </v-container>
    </v-content>
    <v-footer color="primary" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null
  }),
  middleware: ['authCheck'],
  methods: {
    logout() {
      const vm = this
      vm.$store.commit('user/USER_UPDATED', null)
      vm.$router.push('/login')
    }
  }
}
</script>
