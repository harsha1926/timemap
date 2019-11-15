<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto"
      max-width="400"
      type="card-avatar"
    ></v-skeleton-loader>
    <v-card v-else class="ma-1" max-width="400">
      <v-card-title>
        <v-row v-if="user.activity == 'sleep'" class="pa-2">
          <v-col cols="3">
            <v-icon color="primary" large left>fas fa-bed</v-icon>
          </v-col>
          <v-col cols="6">
            <span class="subheading font-weight-light">Sleeping now..</span>
          </v-col>
          <v-col cols="3">
            <span class="overline">{{ user.time }}</span>
          </v-col>
        </v-row>
        <v-row v-if="user.activity == 'breakfast'" class="pa-2">
          <v-col cols="3">
            <v-icon color="primary" large left>fas fa-utensils</v-icon>
          </v-col>
          <v-col cols="6">
            <span class="subheading font-weight-light">Eating...</span>
          </v-col>
          <v-col cols="3">
            <span class="overline">{{ user.time }}</span>
          </v-col>
        </v-row>
        <v-row v-if="user.activity == 'work'" class="pa-2">
          <v-col cols="3">
            <v-icon color="primary" large left>fas fa-business-time</v-icon>
          </v-col>
          <v-col cols="6">
            <span class="subheading font-weight-light">Busy now..</span>
          </v-col>
          <v-col cols="3">
            <span class="overline">{{ user.time }}</span>
          </v-col>
        </v-row>
        <v-row v-if="user.activity == 'free'" class="pa-2">
          <v-col cols="3">
            <v-icon color="primary" large left>fas fa-umbrella-beach</v-icon>
          </v-col>
          <v-col cols="6">
            <span class="subheading font-weight-light">Available now..</span>
          </v-col>
          <v-col cols="3">
            <span class="overline">{{ user.time }}</span>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="subheading font-weight-bold">{{
        user.status
      }}</v-card-text>

      <v-card-actions>
        <v-list-item class="grow">
          <v-list-item-avatar color="grey darken-3">
            <v-img :src="user.photo" class="elevation-6"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>

          <v-row align="center" justify="end">
            <v-icon color="primary" class="mr-3">mdi-phone</v-icon>
            <v-icon color="primary" class="mr-1">mdi-message</v-icon>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    const vm = this
    setTimeout(() => {
      vm.loading = false
    }, 4000)
  }
}
</script>
