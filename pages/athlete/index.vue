<script setup>
    import { ref } from 'vue'
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
        { title: "Fecha de nacimiento", key: "birthDate"}
    ])
    function isPending() {
        return status === 'pending'
    }
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
    <template v-slot:item.sex="{ value }">
        {{ value === 'MALE' ? "Masculino": "Femenino" }}
    </template>
</v-data-table>
</div>
</template>
