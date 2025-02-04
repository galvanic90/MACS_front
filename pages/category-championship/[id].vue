<script setup>
import { ref, computed } from 'vue';
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';
import { useMacsApi } from '~/composables/useMacsApi';

const { fetcher } = useMacsApi();
const route = useRoute()
const championshipId = route.params.id;


const { data: championship } = await useAsyncData('championship', () =>
  fetcher(`/championship/${championshipId}`)
);

// Reactive state
const { data: categoriesChampionship, refresh, status, error } = await useAsyncData('category-championship', () =>
  fetcher(`/championship/${championshipId}/categ-champ`)
);

const headers = ref([
  { title: "Id", value: "id" },
  { title: "Sexo", key: "sex" },
  { title: "Peso", key: "categoriesWeight.name" },
  { title: "Grado", key: "categoriesBeltGrade.name" },
  { title: "Edad", key: "categoriesAge.name" },
  { title: 'Actions', key: 'actions', sortable: false }
]);

const showDialog = ref(false);
const isEditMode = ref(false);
const categoriesForm = ref({ name: '', email: '' });
const saveError = ref('');


const createItem = () => {
  isEditMode.value = false;
  showDialog.value = true;
};

const saveItem = async () => {
  try {
    await fetcher('/categ-champ', {
      method: 'POST',
      body: categoriesForm.value
    });
  
    await refresh(); // Refresh data
    showDialog.value = false;
  } catch (error) {
    console.error('Error al guardar los datos:', error); // Error handling
    saveError.value = 'Error al guardar los datos. Por favor, inténtelo de nuevo.'; // Set error message
  }
};

const cancel = () => {
  showDialog.value = false;
};

const handleDelete = async (id) => {
  try {
    await fetcher(`/categ-champ/${id}`, {
      method: 'DELETE'
    });
    await refresh(); // Refresh data
  } catch (error) {
    console.error('Error al eliminar los datos:', error); // Error handling
  }
};


</script>

<template>
  <v-toolbar flat>
    <v-toolbar-title>Categorías {{ championship.name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="createItem">Asociar Categoría</v-btn>
  </v-toolbar>
  <v-alert v-if="status === 'error'" type="error">Error al obtener los datos</v-alert>
  <v-progress-circular v-if="status === 'loading'" indeterminate></v-progress-circular>
  
  <CrudComponent
    v-if="status === 'success'"
    :items="categoriesChampionship"
    :headers="headers"
    entityName="Categoría campeonato"
    @delete="handleDelete"
  >
  </CrudComponent>

  <!-- Crear/Editar Dialog -->
  <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditMode ? `Editar Categoría` : `Asociar Categoría` }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">

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
