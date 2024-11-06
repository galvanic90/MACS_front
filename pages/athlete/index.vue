<script setup>
    import { computed, nextTick, ref, watch } from 'vue'
    const { status, data, error } = await useMacsApi('/athlete')
    const headers = ref([
        { title: "Id", key: "id"},
        { title: "Nombre", key: "name"},
        { title: "Apellido", key: "lastName"},
        {
            title: "Identificación",
            align: "center",
            children: [
                { title: "Numero", key: "idNumber"},
                { title: "Tipo", key: "documentType.name"}
            ]
            
        },
        { title: 'Pais de nacimiento', key: "homeland.name" },
        { title: 'Cinturon', key: 'belt.color' },
        { title: "Peso", key: 'weight'},
        { title: "Sexo", key: 'sex'},
        { title: "Fecha de nacimiento", key: "birthDate"},
        { title: 'Actions', key: 'actions', sortable: false }
    ])
    const dialog = ref(false)
    const dialogDelete = ref(false)
    const editedIndex = ref(-1)
    const editedItem = ref({})
    const defaultItem = ref({
        name: ''
    })

    function isPending() {
        return status === 'pending'
    }
    function editItem (item) {
        editedIndex.value = data.value.indexOf(item)
        editedItem.value = Object.assign({}, item)
        dialog.value = true
    }

    function deleteItem (item) {
        editedIndex.value = data.value.indexOf(item)
        editedItem.value = Object.assign({}, item)
        dialogDelete.value = true
    }
    function deleteItemConfirm () {
        data.value.splice(editedIndex.value, 1)
        closeDelete()
    }
    function close () {
        dialog.value = false
        nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
        })
    }
    function save () {
        if (editedIndex.value > -1) {
            Object.assign(data.value[editedIndex.value], editedItem.value)
        } else {
            desserts.value.push(editedItem.value)
        }
        close()
    }
    const formTitle = computed(() => {
        return editedIndex.value === -1 ? 'Nuevo atleta' : 'Editar atleta'
    })
    function closeDelete () {
        dialogDelete.value = false
        nextTick(() => {
            editedItem.value = Object.assign({}, defaultItem.value)
            editedIndex.value = -1
        })
  }
  watch(dialog, val => {
    val || close()
  })
  watch(dialogDelete, val => {
    val || closeDelete()
  })
</script>
<template>
<div v-if="status === 'error'">
    Carga de atletas fallida. {{ error }}
</div>
<div v-else>
    <v-data-table
        :items="data"
        item-key="id"
        items-per-page="10"
        :headers="headers"
        :loading=isPending()
    >
    <template v-slot:top>
        <v-toolbar
            flat
        >
            <v-toolbar-title>Atletas</v-toolbar-title>
            <v-divider
            class="mx-4"
            inset
            vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
            v-model="dialog"
            max-width="500px"
            >
            <template v-slot:activator="{ props }">
                <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
                >
                Nuevo atleta
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre"
                    ></v-text-field>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="save"
                >
                    Save
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Estas seguro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">No</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Si</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>
    </template>
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
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.sex="{ value }">
        {{ value === 'MALE' ? "Masculino": "Femenino" }}
    </template>
</v-data-table>
</div>
</template>
