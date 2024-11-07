<script setup>
    import { ref } from 'vue'
    var loading = true
    const { status, data } = await useMacsApi('/club')
    const {data: municipalities} = await useMacsApi('/municipality', {server: false})

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
</v-data-table>
</template>
