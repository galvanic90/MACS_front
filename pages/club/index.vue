<script setup>
    import { ref } from 'vue'
    var loading = true
    const { status, data } = await useMacsApi('/club')

    loading = status === 'pending'
    const headers = ref([
        { title: "Id", value: "id"},
        { title: "Nombre", value: "name"},
        { title: "Email", value: "email"},
        {
            title: "Ubicación",
            align: "center",
            children: [
                { title: "País", key: "country.name"},
                { title: "Departamento", key: "municipality.department.name"},
                { title: "Municipio", key: "municipality.name"}, 
            ]
            
        },
        { title: 'Actions', key: 'actions', sortable: false }

    ])
    function isPending() {
        return status === 'pending'
    }
</script>
<template>
    <v-data-table
        :items="data"
        item-key="id"
        items-per-page="10"
        :loading=isPending()
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
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:top>

    </template>
</v-data-table>
</template>
