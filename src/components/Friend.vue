<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" xl="4">
      <v-row justify="center" align="center">
        <v-col cols="2">
          <v-row align="center" justify="start" class="ma-2">
            <v-avatar slot="icon">
              <v-img :src="friend.photoURL"></v-img>
            </v-avatar>
          </v-row>
        </v-col>

        <v-col cols="7">
          <v-row align="center" justify="center" class="ma-2">
            <span> {{ friend.displayName }} </span>
          </v-row>
        </v-col>

        <v-col cols="3">
          <v-row align="center" justify="end" class="ma-2">
            <v-btn fab icon color="primary">
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    friend: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data: () => ({})
}
</script>
