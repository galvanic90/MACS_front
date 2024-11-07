<script setup>
    import { computed, nextTick, ref, watch } from 'vue'
    import { VDateInput } from 'vuetify/labs/VDateInput'

    const { status, data, error } = await useMacsApi('/athlete')
    const {data: countries} = await useMacsApi('/country', {server: false})
    const {data: clubs} = await useMacsApi('/club', {server: false})
    const {data: documentTypes} = await useMacsApi('/doc-type', {server: false})
    const {data: belts} = await useMacsApi('/belt-grade', {server: false})
    const sexos = [{value: "MALE", title: "Masculino"}, {value: "FEMALE", title: "Femenino"}];
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
        { title: "Club", key: 'club.name'},
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
        editedItem.value.id = item.id
        editedItem.value.name = item.name
        editedItem.value.lastName = item.lastName
        editedItem.value.idNumber = item.idNumber
        editedItem.value.sex = item.sex
        editedItem.value.birthDate = item.birthDate
        if(item.documentType) {
            editedItem.value.documentTypeId = item.documentType.id
        }
        if(item.homeland) {
            editedItem.value.countryId = item.homeland.id
        }
        if(item.club) {
            editedItem.value.clubId = item.club.id
        }
        if(item.belt) {
            editedItem.value.beltId = item.belt.id
        }
        dialog.value = true
    }

    function deleteItem (item) {
        editedIndex.value = data.value.indexOf(item)
        editedItem.value = Object.assign({}, item)
        dialogDelete.value = true
    }
    async function deleteItemConfirm () {
        const res = await $fetch(`http://127.0.0.1:8080/athlete/${editedItem.value.id}`, {
            method: 'DELETE'
        })
        console.log(res)
        closeDelete()
        refresh()
    }
    function close () {
        dialog.value = false
        nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
        })
    }
    async function save () {
        if (editedIndex.value > -1) {
            console.log(editedItem.value)
            const res = await $fetch(`http://127.0.0.1:8080/athlete/${editedItem.value.id}`, {
                method: 'PUT',
                body: editedItem.value
            })
            console.log(res)
        } else {
            const res = await $fetch('http://127.0.0.1:8080/athlete', {
                method: 'POST',
                body: editedItem.value
            })
            console.log(res)
        }
        refresh()
        close()
        
    }
    const formTitle = computed(() => {
        return editedIndex.value === -1 ? 'Nuevo deportista' : 'Editar deportista'
    })
    function closeDelete () {
        dialogDelete.value = false
        
    }
    async function refresh() {
        await refreshNuxtData()
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
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Apellido"
                    ></v-text-field>
                    <v-select
                        label="Tipo de documento"
                        :items="documentTypes"
                        item-title="name"
                        item-value="id"
                        v-model="editedItem.documentTypeId"
                    ></v-select>
                    <v-text-field
                      v-model="editedItem.idNumber"
                      label="Numero de identificación"
                    ></v-text-field>
                    <v-select
                        label="Sexo"
                        :items="sexos"
                        v-model="editedItem.sex"
                    ></v-select>

                    <v-select
                        label="Pais"
                        :items="countries"
                        item-title="name"
                        item-value="id"
                        v-model="editedItem.countryId"
                    ></v-select>
                    <v-select
                        label="Club"
                        :items="clubs"
                        item-title="name"
                        item-value="id"
                        v-model="editedItem.clubId"
                    ></v-select>
                    <v-select
                        label="Cinturon"
                        :items="belts"
                        item-title="color"
                        item-value="id"
                        v-model="editedItem.beltId"
                    ></v-select>
                    
                    <v-date-input 
                        label="Fecha de nacimiento"
                        v-model="editedItem.birthDate"
                    ></v-date-input>


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
