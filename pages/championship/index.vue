<script setup>
import { ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';

import { useMacsApi } from '~/composables/useMacsApi'; const { fetcher } = useMacsApi();

const { data: clubs } = await useAsyncData('club', () =>
    fetcher('/club')
);

const { data: locations } = await useAsyncData('location', () =>
    fetcher('/location')
);

</script>

<template>
  <v-toolbar flat>
      <v-toolbar-title>Campeonatos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="createItem">Crear Campeonato</v-btn>
  </v-toolbar>

  <CrudComponent
      :items="athletes"
      :headers="headers"
      entityName="Atleta"
      @edit="editItem"
      @delete="handleDelete"
    />

      <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditMode ? `Editar Atleta` : `Crear Atleta` }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
          <v-text-field v-model="editedItem.lastName" label="Apellido"></v-text-field>
          <v-select label="Tipo de documento" :items="documentTypes" item-title="name" item-value="id"
            v-model="editedItem.documentTypeId"></v-select>
          <v-text-field v-model="editedItem.idNumber" label="Numero de identificación"></v-text-field>
          <v-select label="Sexo" :items="sexos" v-model="editedItem.sex"></v-select>

          <v-select label="Pais" :items="countries" item-title="name" item-value="id"
            v-model="editedItem.countryId"></v-select>
          <v-select label="Club" :items="clubs" item-title="name" item-value="id"
            v-model="editedItem.clubId"></v-select>
          <v-select label="Cinturon" :items="belts" item-title="color" item-value="id"
            v-model="editedItem.beltId"></v-select>
          <v-text-field v-model="editedItem.weight" label="Peso"></v-text-field>
          <v-date-input label="Fecha de nacimiento" v-model="editedItem.birthDate"></v-date-input>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="cancel">
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveItem">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>