<script setup>
    const { status, data } = await useMacsApi('/athlete')
    const headers = [
        { title: "Id", value: "id"},
        { title: "Nombre", value: "name"},
        { title: "Apellido", value: "lastName"},
        {
            title: "Identificación",
            align: "center",
            children: [
                { title: "Numero", key: "idNumber"},
                { title: "Tipo", key: "documentType.name"}
            ]
            
        },
        { title: 'Pais de nacimiento', value: "homeland.name" },
        { title: 'Cinturon', key: 'belt.color' },
        { title: "Peso", key: 'weight'},
        { title: "Sexo", key: 'sex'},
        { title: "Fecha de nacimiento", key: "birthDate"}
    ]
</script>
<template>
    <div v-if="status === 'pending'">
        Cargando ...
    </div>
    <div v-else>
        <v-data-table
            :items="data"
            item-key="id"
            items-per-page="10"
            :headers="headers"
        >
        <template v-slot:item.sex="{ value }">
            {{ value === 'MALE' ? "Masculino": "Femenino" }}
        </template>
    </v-data-table>
    </div>
</template>
