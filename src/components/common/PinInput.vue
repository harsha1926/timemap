<template>
  <v-row align="center" justify="center">
    <input
      ref="pinInput"
      v-mask="'######'"
      @input="checkIfValid"
      type="tel"
      pattern="[0-9]*"
      name="pinInput"
    />
  </v-row>
</template>
<script>
export default {
  mounted() {
    this.$refs.pinInput.focus()
  },
  methods: {
    checkIfValid(event) {
      if (
        event &&
        event.target &&
        event.target.value &&
        event.target.value.length === 6
      )
        this.$emit('validate', {
          value: event.target.value,
          valid: true
        })
      else this.$emit('validate', { value: event.target.value, valid: false })
    }
  }
}
</script>
<style scoped>
input {
  width: 90%;
  padding: 10px;
  text-align: center;
  border: 0;
  outline: 0;
  background: transparent;
  border: 1px solid rgb(90, 89, 89);
  letter-spacing: 25px;
  font-size: 20px;
  font-family: 'Lexend Mega', sans-serif;
}
</style>
