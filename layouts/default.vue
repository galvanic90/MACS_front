
<template>
    <v-card>
      <v-layout>
        <v-app-bar
          color="primary"
          prominent
        >
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  
          <v-toolbar-title>MACS</v-toolbar-title>
  
          <v-spacer></v-spacer>
  
          <template v-if="$vuetify.display.mdAndUp">
            <v-btn icon="mdi-magnify" variant="text"></v-btn>
  
            <v-btn icon="mdi-filter" variant="text"></v-btn>
          </template>
  
          <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
        </v-app-bar>
  
        <v-navigation-drawer
          v-model="drawer"
          :location="undefined"
          temporary
        >
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :to="item.route"> 
              <v-list-item-title>{{ item.title }}</v-list-item-title> 
           </v-list-item>
           </v-list>
        </v-navigation-drawer>
  
        <v-main>
          <slot />
        </v-main>
      </v-layout>
    </v-card>
  </template>
  <script>
    export default {
      data: () => ({
        drawer: false,
        group: null,
        items: [
          {
            title: 'Deportista',
            route: '/athlete',
          },
          {
            title: 'Club',
            route: '/club',
          },
          {
            title: 'Campeonato',
            route: '/championship',
          },
          {
            title: 'Ubicación',
            route: '/location',
          },
          {
            title: 'Categoría Peso',
            route: '/weight',
          },
          {
            title: 'Categoría cinturón',
            route: '/belt',
          },
        ],
      }),
  
      watch: {
        group () {
          this.drawer = false
        },
      },
    }
  </script>