<script setup>
import { ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';

import { useMacsApi } from '~/composables/useMacsApi'; 
const { fetcher } = useMacsApi();

const {data: locations, refresh, status} = useAsyncData('locations', () =>
  fetcher('/location')
);

const { data: municipalities} = useAsyncData('municipality', () =>
  fetcher('/municipality')
);

const headers = ref([
    { title: "Id", value: "id" },
    { title: "Nombre", value: "name" },
    { title: "Dirección", value: "address"},
    { title: "Teléfono", value: "phoneNumber"},
    { title: "Municipio", value: "municipality.name"},
    { title: 'Actions', value: 'actions', sortable: false }
]);

const showDialog = ref(false);
const isEditMode = ref(false);
const locationForm = ref({ name: '', address: '', phoneNumber: ''});
const saveError = ref('');

const resetLocationForm = () => {
    locationForm.value = { name: '', address: '', phoneNumber: ''};
    saveError.value = ''; // Reset error message
};

const createItem = () => {
  resetLocationForm(); // Reset form
  isEditMode.value = false;
  showDialog.value = true;
};

const editItem = (item) => {
    console.log("item", item) 
    locationForm.value = {
        name: item.name || '',
        address: item.address || '',
        phoneNumber: item.phoneNumber || '',
        municipalityId: item.municipality.id || null,
        id: item.id || null // Assuming 'id' is also a property
    };
    isEditMode.value = true;
    showDialog.value = true;
};

const saveItem = async () => {
  try {
    if (isEditMode.value && locationForm.value.id) {
        console.log(locationForm.value)
        await fetcher(`/location/${locationForm.value.id}`, {
            method: 'PUT',
            body: locationForm.value
        });
    } else {
      await fetcher('/location', {
        method: 'POST',
        body: locationForm.value
      });
    }
    await refresh(); // Refresh data
    showDialog.value = false;
  } catch (error) {
    console.error('Error al guardar los datos:', error); // Error handling
    saveError.value = 'Error al guardar los datos. Por favor, inténtelo de nuevo.'; // Set error message
  }
};

const cancel = () => {
  resetLocationForm(); // Reset form
  showDialog.value = false;
};

const handleDelete = async (id) => {
  try {
    await fetcher(`/location/${id}`, {
      method: 'DELETE'
    });
    await refresh(); // Refresh data
  } catch (error) {
    console.error('Error al eliminar los datos:', error); // Error handling
  }
};

// Watchers to ensure form state doesn't reset unintentionally
watch(showDialog, (newVal) => {
  if (!newVal) {
    resetLocationForm();
  }
});

function municipalityFilter (itemTitle, queryText, item) {
        const municipalityName = item.raw.name.toLowerCase()
        const departmentName = item.raw.department.name.toLowerCase()
        const searchText = queryText.toLowerCase()

        return municipalityName.indexOf(searchText) > -1 ||
            departmentName.indexOf(searchText) > -1
}

</script>

<template>
  <v-toolbar flat>
      <v-toolbar-title>Ubicaciones</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="createItem">Crear Ubicación</v-btn>
  </v-toolbar>

  <v-alert v-if="status === 'error'" type="error">Error al obtener los datos</v-alert>
  <v-progress-circular v-if="status === 'loading'" indeterminate></v-progress-circular>
  
  <CrudComponent
    v-if="status === 'success'"
    :items="locations"
    :headers="headers"
    entityName="Ubicación"
    @edit="editItem"
    @delete="handleDelete"
    />

    <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditMode ? `Editar Ubicación` : `Crear Ubicación` }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
       
        <v-text-field v-model="locationForm.name" label="Nombre"></v-text-field>
        <v-text-field v-model="locationForm.address" label="Dirección"></v-text-field>
        <v-text-field v-model="locationForm.phoneNumber" label="Teléfono"></v-text-field>
        <v-autocomplete
            label="Municipio"
            :items="municipalities"
            item-title="name"
            item-value="id"
            v-model="locationForm.municipalityId"
            :custom-filter="municipalityFilter"
        >
            <template v-slot:item="{ props, item }">
                <v-list-item
                v-bind="props"
                :subtitle="item.raw.department.name"
                :title="item.raw.name"
                ></v-list-item>
            </template>
        </v-autocomplete>       
        </v-form>
        <v-alert v-if="saveError" type="error">{{ saveError }}</v-alert>
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