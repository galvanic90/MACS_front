<script setup>
import { ref, watch } from 'vue';
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';
import { useMacsApi } from '~/composables/useMacsApi';

const { fetcher } = useMacsApi();

// Reactive state
const { data: clubs, refresh, status, error } = useAsyncData('clubs', () =>
  fetcher('/club')
);

const { data: countries } = useAsyncData('country', () =>
  fetcher('/country')
);

const { data: municipalities } = useAsyncData('municipality', () =>
  fetcher('/municipality')
);

const headers = ref([
  { title: "Id", value: "id" },
  { title: "Nombre", value: "name" },
  { title: "Email", value: "email" },
  {
    title: "Ubicación",
    align: "center",
    children: [
      { title: "País", key: "country.name" },
      { title: "Departamento", key: "municipality.department.name" },
      { title: "Municipio", key: "municipality.name" },
    ]
  },
  { title: 'Actions', key: 'actions', sortable: false }
]);

const showDialog = ref(false);
const isEditMode = ref(false);
const clubForm = ref({ name: '', email: '' });
const saveError = ref('');

const resetClubForm = () => {
  clubForm.value = { name: '', email: '' };
  saveError.value = ''; // Reset error message
};

const createItem = () => {
  resetClubForm(); // Reset form
  isEditMode.value = false;
  showDialog.value = true;
};

const editItem = (item) => {
  console.log(item.municipality)
  clubForm.value = {
    name: item.name || '',
    email: item.email || '',
    countryId: item.country.id,
    municipalityId: item.municipality.id,
    id: item.id || null // Assuming 'id' is also a property
  };
  isEditMode.value = true;
  showDialog.value = true;
};

const saveItem = async () => {
  try {
    if (isEditMode.value && clubForm.value.id) {
      await fetcher(`/club/${clubForm.value.id}`, {
        method: 'PUT',
        body: clubForm.value
      });
    } else {
      await fetcher('/club', {
        method: 'POST',
        body: clubForm.value
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
  resetClubForm(); // Reset form
  showDialog.value = false;
};

const handleDelete = async (id) => {
  try {
    await fetcher(`/club/${id}`, {
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
    resetClubForm();
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
    <v-toolbar-title>Clubes</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="createItem">Crear Club</v-btn>
  </v-toolbar>
  <v-alert v-if="status === 'error'" type="error">Error al obtener los datos</v-alert>
  <v-progress-circular v-if="status === 'loading'" indeterminate></v-progress-circular>
  <CrudComponent
    v-if="status === 'success'"
    :items="clubs"
    :headers="headers"
    entityName="Club"
    @edit="editItem"
    @delete="handleDelete"
  >
    <template v-slot:item.actions="{ item }">
      <NuxtLink title="Inscribir atletas" :to="`/club/${item.id}/athlete`"><v-icon small color="blue">mdi-account-check</v-icon></NuxtLink>
    </template>  
  </CrudComponent>

  <!-- Crear/Editar Dialog -->
  <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditMode ? `Editar Club` : `Crear Club` }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="clubForm.name"
            label="Nombre"
          ></v-text-field>
          <v-text-field
            v-model="clubForm.email"
            label="Correo Electrónico"
          ></v-text-field>
          <v-select label="Pais" :items="countries" item-title="name" item-value="id"
            v-model="clubForm.countryId"></v-select>
            <v-autocomplete
              label="Municipio"
              :items="municipalities"
              item-title="name"
              item-value="id"
              v-model="clubForm.municipalityId"
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
        <v-btn color="blue darken-1" text @click="cancel">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveItem">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
