<script setup>
    import CrudComponent from '~/components/CrudComponent.vue';
    import { ref } from 'vue'

    // Define reactive state variables
    const { data: clubs, refresh } = useAsyncData('clubs', () =>
      $fetch('http://localhost:8080/club')
    );
    

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

    
    const handleSave = async (club) => {
      if (club.id) {
        await useFetch(`http://localhost:8080/club/${club.id}`, {
          method: 'PUT',
          body: club,
        });
      } else {
        await useFetch('http://localhost:8080/club', {
          method: 'POST',
          body: club,
        });
      }
      await refresh();
    };
    
    const handleDelete = async (id) => {
      await useFetch(`http://localhost:8080/club/${id}`, {
        method: 'DELETE',
      });
      await refresh();
    };
  
</script>
<template>

<CrudComponent :items="clubs" :headers="headers" entityName="Club" @save="handleSave" @delete="handleDelete" >
  <template #form="{ form }">
              <v-text-field v-model="form.name" label="Name"></v-text-field>
              <v-text-field v-model="form.email" label="Email"></v-text-field>
              <v-select
                v-model="form.department"
                :items="departments"
                item-text="name"
                item-value="id"
                label="Department"
              ></v-select>
            </template>
  </CrudComponent>

</template>
