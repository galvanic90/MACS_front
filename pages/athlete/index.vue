<script setup>
    const { status, data } = await useMacsApi('/athlete')

    
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
        ></v-data-table>
    </div>
</template>
