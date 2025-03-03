<script setup>
import { ref } from 'vue';

// Define props using defineProps
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  headers: {
    type: Array,
    required: true
  },
  entityName: {
    type: String,
    required: true
  },
  editable: {
    type: Boolean,
    default: true
  },
  removable: {
    type: Boolean,
    default: true
  },
  showSelect: {
    type: Boolean,
    default: false
  }
});

// Define emits using defineEmits
const emit = defineEmits(['edit', 'delete']);

// State variables
const showDeleteConfirmDialog = ref(false);
const itemToDelete = ref(null);

// Methods
const editItem = (item) => {
  emit('edit', item);
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteConfirmDialog.value = true;
};

const deleteItem = () => {
  emit('delete', itemToDelete.value.id);
  showDeleteConfirmDialog.value = false;
};
</script>

<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        :items-per-page="5"
        items-per-page-text="Elementos por página:"
        density="compact"
      >
      <template v-slot:item.actions="{ item }">
        <v-icon v-if="editable==true" small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
        <slot name="item.actions" :item="item">
        </slot>
        <v-icon v-if="removable==true" small @click="confirmDelete(item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
  <!-- Confirmación de Eliminación Dialog -->
  <v-dialog v-model="showDeleteConfirmDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Confirmar Eliminación</span>
      </v-card-title>
      <v-card-text>
        ¿Está seguro de que desea eliminar este {{ entityName }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="showDeleteConfirmDialog = false">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="deleteItem">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
