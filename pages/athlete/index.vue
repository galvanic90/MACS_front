<script setup>
import { ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAsyncData } from 'nuxt/app';
import CrudComponent from '~/components/CrudComponent.vue';

import { useMacsApi } from '~/composables/useMacsApi'; const { fetcher } = useMacsApi();


// Reactive state
const { data: athletes, refresh, status } = await useAsyncData('athlete', () =>
  fetcher('/athlete')
);

const { data: countries } = await useAsyncData('country', () =>
  fetcher('/country')
);
const { data: clubs } = await useAsyncData('club', () =>
  fetcher('/club')
);
const { data: documentTypes } = await useAsyncData('doc-type', () =>
  fetcher('/doc-type')
);
const { data: belts } = await useAsyncData('belt-grade', () =>
  fetcher('/belt-grade')
);

const sexos = [{ value: "MALE", title: "Masculino" }, { value: "FEMALE", title: "Femenino" }];
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

const showDialog = ref(false);
const isEditMode = ref(false);
const editedItem = ref({})

function editItem(item) {
  console.log(item)
  editedItem.value.id = item.id
  editedItem.value.name = item.name
  editedItem.value.lastName = item.lastName
  editedItem.value.idNumber = item.idNumber
  editedItem.value.sex = item.sex
  editedItem.value.birthDate = item.birthDate
  editedItem.value.weight = item.weight
  if (item.documentType) {
    editedItem.value.documentTypeId = item.documentType.id
  }
  if (item.homeland) {
    editedItem.value.countryId = item.homeland.id
  }
  if (item.club) {
    editedItem.value.clubId = item.club.id
  }
  if (item.belt) {
    editedItem.value.beltId = item.belt.id
  }
  showDialog.value = true;
  isEditMode.value = true;
}

const saveItem = async () => {
  console.log(editedItem)
  try {
    if (isEditMode.value && editedItem.value.id) {
      await fetcher(`/athlete/${editedItem.value.id}`, {
        method: 'PUT',
        body: editedItem.value
      });
    } else {
      await fetcher('/athlete', {
        method: 'POST',
        body: editedItem.value
      });
    }
    await refresh(); // Refresh data
    showDialog.value = false;
  } catch (error) {
    console.error('Error al guardar los datos:', error); // Error handling
  }
};

const resetAthleteForm = () => {
  editedItem.value = { name: '', sport: '', nationality: '' };
};

const createItem = () => {
  resetAthleteForm(); // Reset form
  isEditMode.value = false;
  showDialog.value = true;
};

const handleDelete = async (id) => {
  try {
    await fetcher(`/athlete/${id}`, {
      method: 'DELETE'
    });
    await refresh(); // Refresh data
  } catch (error) {
    console.error('Error al eliminar los datos:', error); // Error handling
  }
};

const cancel = () => {
  resetAthleteForm(); // Reset form
  showDialog.value = false;
};
</script>

<template>
  <v-toolbar flat>
      <v-toolbar-title>Deportistas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="createItem">Crear Atleta</v-btn>
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
