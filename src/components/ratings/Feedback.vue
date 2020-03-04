<template>
  <v-container fluid>
    <v-row align="center">
      <v-col @click="$emit('feedback-clicked', -100)">
        <v-avatar v-if="feedback == -100" size="70">
          <v-img src="emojis/1.gif"></v-img>
        </v-avatar>
        <v-avatar v-else style="opacity: 0.4">
          <v-img src="emojis/1.gif"></v-img>
        </v-avatar>
      </v-col>
      <v-col @click="$emit('feedback-clicked', -50)">
        <v-avatar v-if="feedback == -50" size="70">
          <v-img src="emojis/2.gif"></v-img>
        </v-avatar>
        <v-avatar v-else style="opacity: 0.4">
          <v-img src="emojis/2.gif"></v-img>
        </v-avatar>
      </v-col>
      <v-col @click="$emit('feedback-clicked', 20)">
        <v-avatar v-if="feedback == 20" size="70">
          <v-img src="emojis/3.gif"></v-img>
        </v-avatar>
        <v-avatar v-else style="opacity: 0.4">
          <v-img src="emojis/3.gif"></v-img>
        </v-avatar>
      </v-col>
      <v-col @click="$emit('feedback-clicked', 50)">
        <v-avatar v-if="feedback == 50" size="70">
          <v-img src="emojis/4.gif"></v-img>
        </v-avatar>
        <v-avatar v-else style="opacity: 0.4">
          <v-img src="emojis/4.gif"></v-img>
        </v-avatar>
      </v-col>
      <v-col @click="$emit('feedback-clicked', 100)">
        <v-avatar v-if="feedback == 100" size="70">
          <v-img src="emojis/5.gif"></v-img>
        </v-avatar>
        <v-avatar v-else style="opacity: 0.4">
          <v-img src="emojis/5.gif"></v-img>
        </v-avatar>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    feedback: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
