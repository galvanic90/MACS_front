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
            
        }
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
    <template v-slot:item.sex="{ value }">
        {{ value === 'MALE' ? "Masculino": "Femenino" }}
    </template>
</v-data-table>
</template>
