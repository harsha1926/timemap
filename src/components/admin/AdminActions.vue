<template>
  <v-row align="center" justify="center">
    <v-card max-width="400">
      <v-card-title class="nameTitle">Admin Actions</v-card-title>
      <v-card-text>
        <v-card color="grey lighten-2" class="ma-2 pa-2">
          <v-card-title class="nameTitle">Manage GIFs</v-card-title>
          <v-card-actions>
            <v-btn to="/admin/gifs" color="primary" text>Select</v-btn>
          </v-card-actions>
        </v-card>
        <v-card color="grey lighten-2" class="ma-2 pa-2">
          <v-card-title class="nameTitle">Manage Quotes</v-card-title>
          <v-card-actions>
            <v-btn to="/admin/quotes" color="primary" text>Select</v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>
  </v-row>
</template>
<style scoped>
.nameTitle {
  font-size: 16px;
  font-family: 'Lexend Mega', sans-serif;
  font-weight: 900;
}
</style>