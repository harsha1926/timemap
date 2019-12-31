<template>
  <div>
    <v-row justify="center">
      <croppa
        ref="croppedImage"
        :prevent-white-space="true"
        :show-remove-button="false"
        :show-loading="true"
        :loading-size="50"
        :width="width"
        :height="width"
        :initial-image="photoURL"
        @new-image-drawn="uploadPhoto"
        @move="changesMade = true"
        @zoom="changesMade = true"
        loading-color="#e67e22"
      ></croppa>
    </v-row>
    <v-row justify="center" class="ma-2 pa-2">
      <v-btn @click="removePhoto" text class="ma-2">Remove Photo</v-btn>
      <v-btn
        v-if="!changesMade"
        @click="choosePhoto"
        text
        color="primary"
        class="ma-2"
        >Change Photo</v-btn
      >
      <v-btn
        v-if="changesMade"
        @click="uploadPhoto"
        text
        color="primary"
        class="ma-2"
        >Save Changes</v-btn
      >
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { firebaseStorage, firebaseDB } from '@/services/firebaseInit.js'
export default {
  data: () => ({
    changesMade: false
  }),
  computed: {
    ...mapGetters('user', ['uid', 'photoURL']),
    width() {
      if (window.innerWidth < 600) return window.innerWidth
      else return 390
    }
  },
  methods: {
    ...mapActions('user', ['addPhotoURL']),
    choosePhoto() {
      this.$refs.croppedImage.chooseFile()
    },
    removePhoto() {
      this.$refs.croppedImage.remove()
      const vm = this
      const storageRef = firebaseStorage.ref('users/nothing.png')
      storageRef.getDownloadURL().then((url) => {
        firebaseDB
          .ref('users')
          .child(vm.uid)
          .update({
            photoURL: url
          })
        vm.addPhotoURL(url)
      })
    },
    uploadPhoto() {
      const vm = this
      if (vm.$refs.croppedImage && vm.$refs.croppedImage.img) {
        if (vm.$refs.croppedImage.img.src !== vm.photoURL) {
          vm.$refs.croppedImage.generateBlob((blob) => {
            const storageRef = firebaseStorage.ref('users/' + vm.uid)
            storageRef.put(blob).then(() => {
              storageRef.getDownloadURL().then((url) => {
                firebaseDB
                  .ref('users')
                  .child(vm.uid)
                  .update({
                    photoURL: url
                  })
                vm.addPhotoURL(url)
                vm.changesMade = false
              })
            })
          })
        }
      }
    }
  }
}
</script>
