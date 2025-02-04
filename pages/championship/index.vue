<script setup>
import { ref } from 'vue';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';

import { useMacsApi } from '~/composables/useMacsApi'; const { fetcher } = useMacsApi();

const { data: championships, refresh, status } = await useAsyncData('championships', () =>
    fetcher('/championship')
);

const { data: locations } = await useAsyncData('location', () =>
    fetcher('/location')
);

const { data: clubs } = await useAsyncData('club', () =>
  fetcher('/club')
);

const headers = ref([
    { title: "Id", value: "id" },
    { title: "Nombre", value: "name" },
    { title: "Fecha inicio", value: "startEventDate"},
    { title: "Fecha fin", value: "endEventDate"},
    { title: "Ubicación", value: "location.name"},
    { title: "Club", value: "club.name"},
    { title: 'Actions', value: 'actions', sortable: false }
]);

const showDialog = ref(false);
const isEditMode = ref(false);
const championshipForm = ref({ name: '', startEventDate: '', endEventDate: ''});
const saveError = ref('');

const resetLocationForm = () => {
  championshipForm.value = { name: '', startEventDate: '', endEventDate: ''};
  saveError.value = ''; // Reset error message
};

const createItem = () => {
  resetLocationForm(); // Reset form
  isEditMode.value = false;
  showDialog.value = true;
};

const editItem = (item) => {
  championshipForm.value = {
    name: item.name || '',
    startEventDate: item.startEventDate || '',
    endEventDate: item.endEventDate || '',
    location:item.location?.id || null,
    club:item.club?.id || null,
    id: item.id || null
  }
  isEditMode.value = true;
  showDialog.value = true;
}

const saveItem = async () => {
  try {
    if(isEditMode.value && championshipForm.value.id){
      await fetcher(`/championship/${championshipForm.value.id}`, {
        method: 'PUT',
        body: championshipForm.value
      })
    } else{
      await fetcher('/championship', {
        method: 'POST',
        body: championshipForm.value
      });
    }
    await refresh(); // Refresh data
    showDialog.value = false;
  } catch (error) {
    console.error('Error al guardar los datos:', error); // Error handling
    saveError.value = 'Error al guardar los datos. Por favor, inténtelo de nuevo.'; // Set error message
  }
}

const cancel = () => {
  resetLocationForm(); // Reset form
  showDialog.value = false;
};

const handleDelete = async (id) => {
  try {
    await fetcher(`/championship/${id}`, {
      method: 'DELETE'
    });
    await refresh(); // Refresh data
  } catch (error) {
    console.error('Error al eliminar los datos:', error); // Error handling
  }
};

watch(showDialog, (newVal) => {
  if (!newVal) {
    resetLocationForm();
  }
});

</script>

<template>
  <v-toolbar flat>
      <v-toolbar-title>Campeonatos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="createItem">Crear Campeonato</v-btn>
  </v-toolbar>

  <CrudComponent
      :items="championships"
      :headers="headers"
      entityName="Campeonato"
      @edit="editItem"
      @delete="handleDelete"
    />

      <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditMode ? `Editar Campeonato` : `Crear Campeonato` }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="championshipForm.name" label="Nombre"></v-text-field>
          <v-date-input label="Fecha inicio" v-model="championshipForm.startEventDate"></v-date-input>
          <v-date-input label="Fecha fin" v-model="championshipForm.endEventDate"></v-date-input>
          <v-select label="Ubicaciones" :items="locations" item-title="name" item-value="id" v-model="championshipForm.location"></v-select>  
          <v-select label="Club" :items="clubs" item-title="name" item-value="id"
            v-model="championshipForm.clubId"></v-select>

      </v-form>   
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