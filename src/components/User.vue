<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto"
      max-width="400"
      type="card-avatar"
    ></v-skeleton-loader>
    <v-card v-else class="ma-1" max-width="400" img>
      <v-img
        height="200px"
        :src="activityPhoto"
        class="white--text"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-card-title>
          <v-row>
            <v-col cols="9">
              <span class="subheading font-weight-thin">{{
                activityHeading
              }}</span>
            </v-col>
            <v-col cols="3">
              <span class="caption">{{ user.time }}</span>
            </v-col>
          </v-row>
        </v-card-title>
      </v-img>
      <v-card-text class="subheading font-weight-bold">{{
        statusText
      }}</v-card-text>

      <v-card-actions>
        <v-list-item class="grow">
          <v-list-item-avatar size="80" color="grey darken-3">
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
  computed: {
    activityIcon() {
      if (this.user.activity === 'sleep') return 'fas fa-bed'
      else if (this.user.activity === 'breakfast') return 'fas fa-utensils'
      else if (this.user.activity === 'work') return 'fas fa-business-time'
      else if (this.user.activity === 'free') return 'fas fa-umbrella-beach'
      else return ''
    },
    activityPhoto() {
      if (this.user.activity === 'sleep')
        return 'https://media.tenor.com/images/e498a53565bac7f47dd901c0676ccc53/tenor.gif'
      else if (this.user.activity === 'breakfast') return 'https://i.chzbgr.com/full/8191306240/h73FB4A28/the-only-way-to-eat-a-burger'
      else if (this.user.activity === 'work') return 'https://media.tenor.com/images/c18c487d770dbaef16ea7521cfe4f7d2/tenor.gif'
      else if (this.user.activity === 'free') return 'https://media.tenor.com/images/86002300e062cd49c4e5eac9748f7546/tenor.gif'
      else return ''
    },
    activityHeading() {
      if (this.user.activity === 'sleep') return 'Sleeping now..'
      else if (this.user.activity === 'breakfast') return 'Eating...'
      else if (this.user.activity === 'work') return 'Busy now..'
      else if (this.user.activity === 'free') return 'Available now..'
      else return ''
    },
    statusText() {
      if (this.user.status) return this.user.status
      else if (this.user.activity === 'sleep') return 'Sleeping now..'
      else if (this.user.activity === 'breakfast') return 'Eating...'
      else if (this.user.activity === 'work') return 'Busy now..'
      else if (this.user.activity === 'free') return 'Available now..'
      else return ''
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
