<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <span v-if="isStart" class="subtitle-1">I wake up at</span>
        <span v-else class="subtitle-1">I sleep at</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-time-picker
          ref="time"
          v-model="time"
          :min="minTime"
          :max="maxTime"
          :full-width="$vuetify.breakpoint.xsOnly"
          format="24hr"
        ></v-time-picker>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="4">
        <v-switch v-model="applyToAllDays" label="All days"></v-switch>
      </v-col>
      <v-col cols="8" class="text-right">
        <v-btn @click="cancel" text>Cancel</v-btn>
        <v-btn @click="save" :disabled="!time" color="primary">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    selectedTime: {
      type: String,
      default() {
        return null
      }
    },
    isStart: {
      type: Boolean,
      default() {
        return true
      }
    },
    minTime: {
      type: String,
      default() {
        return null
      }
    },
    maxTime: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      time: null,
      applyToAllDays: true
    }
  },
  methods: {
    cancel() {
      this.$emit('dialog-closed')
      this.time = null
    },
    save() {
      this.$emit('activity-updated', {
        time: this.time,
        applyToAllDays: this.applyToAllDays
      })
      this.$emit('dialog-closed')
      this.time = null
    }
  },
  watch: {
    selectedTime(newVal) {
      if (newVal) {
        this.time = newVal
      } else {
        this.time = null
      }
    }
  }
}
</script>
