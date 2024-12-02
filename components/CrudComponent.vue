

<script setup>
import { ref, watch } from 'vue';

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
  }
});

// Define emits using defineEmits
const emit = defineEmits(['save', 'delete']);

// State variables
const showDialog = ref(false);
const isEditMode = ref(false);
const form = ref({});
const showDeleteConfirmDialog = ref(false);
const itemToDelete = ref(null);

// Methods
const saveItem = () => {
  emit('save', form.value);
  showDialog.value = false;
};

const editItem = (item) => {
  isEditMode.value = true;
  form.value = { ...item };
  showDialog.value = true;
};


const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteConfirmDialog.value = true;
};

const deleteItem = () => {
  emit('delete', itemToDelete.value.id);
  showDeleteConfirmDialog.value = false;
};

watch(props.items, (newItems) => {
  if (!isEditMode.value) {
    form.value = {};
  }
});
</script>

<template>
    <v-data-table
        :items="items"
        item-key="id"
        items-per-page="10"
        :headers="headers"
    >
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="editItem(item)"
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
<!-- Create/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditMode ? `Edit ${entityName}` : `Create ${entityName}` }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <slot name="form" :form="form"></slot>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="showDeleteConfirmDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Confirm Delete</span>
            </v-card-title>
            <v-card-text>
              Are you sure you want to delete this {{ entityName }}?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showDeleteConfirmDialog = false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItem">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>
