<script setup>
import { ref } from 'vue'
import { useAsyncData } from 'nuxt/app';

import { useMacsApi } from '~/composables/useMacsApi'; const { fetcher } = useMacsApi();
const route = useRoute()
const clubId = route.params.id


// Reactive state
const { data: athletes, refresh, status } = await useAsyncData('athlete', () =>
  fetcher(`/club/${clubId}/athlete`)
);

const { data: categories } = await useAsyncData('categories', () =>
    fetcher(`/categ-champ`)
  );

const category = ref()
const selected = ref([])

const headers = ref([
  { title: "Id", key: "id" },
  { title: "Nombre", key: "name" },
  { title: "Apellido", key: "lastName" },
  {
    title: "Identificación",
    align: "center",
    children: [
      { title: "Numero", key: "idNumber" },
      { title: "Tipo", key: "documentType.name" }
    ]

  },
  { title: 'Pais de nacimiento', key: "homeland.name" },
  { title: 'Cinturon', key: 'belt.color' },
  { title: "Peso", key: 'weight' },
  { title: "Sexo", key: 'sex' },
  { title: "Fecha de nacimiento", key: "birthDate" },
  { title: "Club", key: 'club.name' },
  { title: 'Actions', key: 'actions', sortable: false }
])

const inscribir = async () => {
  console.log(selected.value)
  console.log(category.value)
  try {
    await fetcher('/registrations', {
      method: 'POST',
      body: {
        category: category.value,
        athletes: selected.value
      }
    });
  } catch (error) {
    console.error('Error al guardar los datos:', error); // Error handling
    saveError.value = 'Error al guardar los datos. Por favor, inténtelo de nuevo.'; // Set error message
  }
}
const saveError = ref('');
</script>

<template>
  <v-toolbar flat>
      <v-toolbar-title>Deportistas</v-toolbar-title>
      <v-spacer></v-spacer>
  </v-toolbar>

  <v-select label="Categories" :items="categories" v-model="category" item-value="id" :item-title="(item)=>`${item.id} - ${item.sex} ${item.categoriesWeight?.name} ${item.categoriesBeltGrade?.name} ${item.categoriesAge?.name}`"></v-select>
  <v-data-table
    v-model="selected"
    :items="athletes"
    :headers="headers"
    entityName="Atleta"
    show-select
  />
  <v-alert v-if="saveError" type="error">{{ saveError }}</v-alert>

  <v-btn @click="inscribir">Inscribir</v-btn>
</template>