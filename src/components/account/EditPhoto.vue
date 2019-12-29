<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" align="center" justify="center">
        <span>Edit Photo</span>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="mx-auto" max-width="400">
          <v-img :src="photoURL" content></v-img>
          <v-row justify="end" mr-1>
            <v-btn
              @click="editProfilePhoto"
              class="ma-2"
              color="primary"
              fab
              absolute
              bottom
              right
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-row>
        </v-card>
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
