<script setup>
import { ref } from 'vue';
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';
import { useMacsApi } from '~/composables/useMacsApi';

const { fetcher } = useMacsApi();
const route = useRoute()

// Reactive state
const { data: categories, refresh, status, error } = await useAsyncData('category-championship', () =>
  fetcher(`/category-belt-grade`)
);



const headers = ref([
  { title: "Id", value: "id" },
  { title: "Nombre", key: "name" },
  { title: 'Actions', value: 'actions', sortable: false }
]);

const showDialog = ref(false);
const isEditMode = ref(false);
const categoriesForm = ref({  });
const saveError = ref('');


const createItem = () => {
  isEditMode.value = false;
  showDialog.value = true;
  saveError.value = false;
  categoriesForm.value = {
    name: ""
  }
};

const cancel = () => {
  showDialog.value = false;
};

const handleDelete = async (id) => {
  try {
    await fetcher(`/category-belt-grade/${id}`, {
      method: 'DELETE'
    });
    await refresh(); // Refresh data
  } catch (error) {
    console.error('Error al eliminar los datos:', error); // Error handling
  }
};

const editItem = (item) => {

  categoriesForm.value = {
    id: item.id,
    name: item.name || '',
  }
  isEditMode.value = true;
  showDialog.value = true;
}

const saveItem = async () => {

  try {
    if(isEditMode.value && categoriesForm.value.id){
      await fetcher(`/category-belt-grade/${categoriesForm.value.id}`, {
        method: 'PUT',
        body: categoriesForm.value
      })
    } else{
  
      await fetcher('/category-belt-grade', {
        method: 'POST',
        body: categoriesForm.value
      });
    }
    await refresh(); // Refresh data
    showDialog.value = false;
  } catch (error) {
    console.error('Error al guardar los datos:', error); // Error handling
    saveError.value = 'Error al guardar los datos. Por favor, inténtelo de nuevo.'; // Set error message
  }
}

</script>

<template>
  <v-toolbar flat>
    <v-toolbar-title>Categorías</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="createItem">Crear Categoría</v-btn>
  </v-toolbar>
  <v-alert v-if="status === 'error'" type="error">Error al obtener los datos</v-alert>
  <v-progress-circular v-if="status === 'loading'" indeterminate></v-progress-circular>
  
  <CrudComponent
    v-if="status === 'success'"
    :items="categories"
    :headers="headers"
    entityName="Categoría campeonato"
    @delete="handleDelete"
    @edit="editItem"
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
          <v-text-field v-model="categoriesForm.name" label="Nombre"></v-text-field>
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
