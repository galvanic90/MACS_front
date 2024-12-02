<script setup>
import { ref } from 'vue';

// Definir props utilizando defineProps
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
  }
});

// Definir emits utilizando defineEmits
const emit = defineEmits(['edit', 'delete']);

// Variables de estado
const showDeleteConfirmDialog = ref(false);
const itemToDelete = ref(null);

// Métodos
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
    <v-data-table
        :items="items"
        item-key="id"
        items-per-page="10"
        :headers="headers"
    >
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>{{entityName}}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="$emit('edit', item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
</v-data-table>

    <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="showDeleteConfirmDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">¿Estas seguro?</span>
            </v-card-title>
            <v-card-text>
              ¿Quieres eliminar este {{ entityName }}?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showDeleteConfirmDialog = false">No</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItem">Si</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>
