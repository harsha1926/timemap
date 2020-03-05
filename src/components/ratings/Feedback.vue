<template>
  <v-row align="center" justify="space-between" class="mt-0 pt-0">
    <v-col class="mt-0 pt-0" @click="$emit('feedback-clicked', -100)">
      <v-avatar v-if="feedback == -100" size="60">
        <v-img src="emojis/1.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/1.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col class="mt-0 pt-0" @click="$emit('feedback-clicked', -50)">
      <v-avatar v-if="feedback == -50" size="60">
        <v-img src="emojis/2.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/2.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col class="mt-0 pt-0" @click="$emit('feedback-clicked', 20)">
      <v-avatar v-if="feedback == 20" size="60">
        <v-img src="emojis/3.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/3.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col class="mt-0 pt-0" @click="$emit('feedback-clicked', 50)">
      <v-avatar v-if="feedback == 50" size="60">
        <v-img src="emojis/4.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/4.gif"></v-img>
      </v-avatar>
    </v-col>
    <v-col class="mt-0 pt-0" @click="$emit('feedback-clicked', 100)">
      <v-avatar v-if="feedback == 100" size="60">
        <v-img src="emojis/5.gif"></v-img>
      </v-avatar>
      <v-avatar v-else style="opacity: 0.4" size="45">
        <v-img src="emojis/5.gif"></v-img>
      </v-avatar>
    </v-col>
  </v-row>
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
