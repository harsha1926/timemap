<template>
  <v-container fluid class="ma-0 pa-0" style="max-width: 600px;">
    <v-row justify="center">
      <v-col cols="12">
        <v-img :src="photoURL" content></v-img>
        <v-row justify="end" mr-1>
          <v-btn @click="editProfilePhoto" class="ma-2" color="primary" fab absolute bottom right>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('user', ['photoURL'])
  },

  methods: {
    editProfilePhoto() {
      console.log('editProfilePhoto')
    }
  }
}
</script>
