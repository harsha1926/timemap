<template>
  <v-container
    fluid
    fill-height
    style="max-width: 600px; height: 85vh; max-height: 85%;"
  >
    <v-row wrap align="center" justify="center">
      <v-card>
        <v-card-title class="primary--text">Admin Actions</v-card-title>
        <v-card-text>
          <v-row>
            <v-flex>
              <v-card color="grey lighten-2" class="ma-2 pa-2">
                <v-card-title>Manage GIFs</v-card-title>
                <v-card-actions>
                  <v-btn to="/admin/gifs" color="primary" text>Select</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex>
              <v-card color="grey lighten-2" class="ma-2 pa-2">
                <v-card-title>Manage Quotes</v-card-title>
                <v-card-actions>
                  <v-btn to="/admin/quotes" color="primary" text>Select</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
