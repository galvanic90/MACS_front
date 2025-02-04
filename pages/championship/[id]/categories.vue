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

const { data: belts } = await useAsyncData('belts', () =>
  fetcher(`/category-belt-grade`)
);

const { data: weights } = await useAsyncData('weights', () =>
  fetcher(`/category-weight`)
);

const { data: ages } = await useAsyncData('ages', () =>
  fetcher(`/category-age`)
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
const categoriesForm = ref({  });
const saveError = ref('');


const createItem = () => {
  isEditMode.value = false;
  showDialog.value = true;
  saveError.value = false;
  categoriesForm.value = {
    championship: championshipId,
    sex: "",
    weight: "",
    age: "",
    belt: ""
  }
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
const sexos = [{ value: "MALE", title: "Masculino" }, { value: "FEMALE", title: "Femenino" }];


</script>

<template>
  <v-toolbar flat>
    <v-toolbar-title>Categorías {{ championship? championship.name: "Campeonatos" }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="championship" color="primary" @click="createItem">Asociar Categoría</v-btn>
  </v-toolbar>
  <v-alert v-if="status === 'error'" type="error">Error al obtener los datos</v-alert>
  <v-progress-circular v-if="status === 'loading'" indeterminate></v-progress-circular>
  <v-alert v-if="!championship" type="error">Campeonato no valido</v-alert>
  <CrudComponent v-else
    v-if="status === 'success'"
    :items="categoriesChampionship"
    :headers="headers"
    entityName="Categoría campeonato"
    @delete="handleDelete"
    editable="false"
  >
    <template v-slot:item.actions="{ item }">
      <NuxtLink title="Ver Piramide" :to="`/pyramid/${item.id}`"><v-icon small color="blue">mdi-triangle</v-icon></NuxtLink>
    </template>
  </CrudComponent>

  <!-- Crear/Editar Dialog -->
  <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditMode ? `Editar Categoría` : `Asociar Categoría` }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select label="Sexo" :items="sexos" v-model="categoriesForm.sex"></v-select>
          <v-select label="Peso" :items="weights" v-model="categoriesForm.weight" item-value="id" item-title="name"></v-select>
          <v-select label="Edad" :items="ages" v-model="categoriesForm.age" item-value="id" item-title="name"></v-select>
          <v-select label="Experiencia" :items="belts" v-model="categoriesForm.belt" item-value="id" item-title="name"></v-select>
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
