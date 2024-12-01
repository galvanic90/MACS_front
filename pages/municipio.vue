<script setup>
    function municipalityFilter (itemTitle, queryText, item) {
        const municipalityName = item.raw.name.toLowerCase()
        const departmentName = item.raw.department.name.toLowerCase()
        const searchText = queryText.toLowerCase()

        return municipalityName.indexOf(searchText) > -1 ||
            departmentName.indexOf(searchText) > -1
    }
</script>
<template>
    <v-autocomplete
        label="Municipio"
        :items="municipalities"
        item-title="name"
        item-value="id"
        v-model="municipality"
        :custom-filter="municipalityFilter"
    >
        <template v-slot:item="{ props, item }">
            <v-list-item
            v-bind="props"
            :subtitle="item.raw.department.name"
            :title="item.raw.name"
            ></v-list-item>
        </template>
    </v-autocomplete>
</template>