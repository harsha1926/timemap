<template>
  <v-app id="timeMap">
    <v-app-bar app color="#ffffff">
      <v-avatar tile size="30">
        <v-img src="/icon.png"></v-img>
      </v-avatar>
      <span class="appTitle primary--text">TIMEMAP</span>
      <v-row v-if="user" justify="end" align="center">
        <span v-if="user.displayName" class="appGreeting mr-5 d-none d-sm-block"
          >Hello {{ user.displayName }}</span
        >
        <v-btn fab icon to="/account">
          <v-avatar v-if="user.photoURL" class size="40">
            <v-img :src="user.photoURL"></v-img>
          </v-avatar>
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <nuxt v-if="user"></nuxt>
        <login v-else></login>
      </v-container>
    </v-content>

    <v-bottom-navigation
      :value="activeTab"
      v-if="user"
      grow
      color="primary"
      app
    >
      <v-btn to="/">
        <span>Friends</span>
        <v-icon small>mdi-heart</v-icon>
      </v-btn>
      <v-btn to="/findFriends">
        <span>Find Friends</span>
        <v-icon small>fas fa-search</v-icon>
      </v-btn>
      <v-btn to="/familyTree">
        <span>Family Tree</span>
        <v-icon small>fas fa-sitemap</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import Login from '~/components/login/Login'
export default {
  components: {
    Login
  },
  data: () => ({
    on: false,
    activeTab: 0
  }),
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  mounted() {
    this.activeTab = this.getActiveTab()
  },
  methods: {
    getActiveTab() {
      if (this.$route.path.includes('findFriends')) {
        return 1
      }
      if (this.$route.path.includes('familyTree')) {
        return 2
      }
      return 0
    }
  }
}
</script>
<style scoped>
.appTitle {
  font-size: 24px;
  font-family: 'Turret Road', cursive;
  font-weight: 900;
}
.appGreeting {
  font-size: 12px;
  font-family: 'Lexend Mega', sans-serif;
}
.v-bottom-navigation {
  padding: 1px !important;
}
.v-bottom-navigation .v-btn {
  height: inherit !important;
}
</style>
