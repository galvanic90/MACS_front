<template>
  <div v-if="!rounds" >
    No se encontraron combates para la categoría seleccionada
  </div>
  <template v-else>
    <div>
      {{ category.championship.name }}
      {{ category.sex }}
      {{ category.categoriesAge?.name }}
      {{ category.categoriesWeight?.name }}
      {{ category.categoriesBeltGrade?.name }}
    </div>
    <TournamentBracket
      :rounds="rounds"
      @onMatchClick="onMatchClick"
      @onParticipantClick="onParticipantClick"
    />
  </template>
  <v-dialog v-model="showDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Combate</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select label="Azul" :items="registrations" item-title="athlete.name" item-value="id"
            v-model="combatForm.athleteBlue"></v-select>
          <v-text-field v-model="combatForm.pointsBlue" label="Puntos azul"></v-text-field>
          <v-select label="Rojo" :items="registrations" item-title="athlete.name" item-value="id"
            v-model="combatForm.athleteRed"></v-select>
          <v-text-field v-model="combatForm.pointsRed" label="Puntos rojo"></v-text-field>
          <v-select label="Ganador" :items="registrations" item-title="athlete.name" item-value="id"
            v-model="combatForm.winner"></v-select>
            {{ players }}
        </v-form>
        <v-alert v-if="saveError" type="error">{{ saveError }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveItem">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { TournamentBracket } from "vue3-tournament"
  import "vue3-tournament/style.css"
  const { fetcher } = useMacsApi();
  const route = useRoute()
  const categoryId = route.params.id
  const showDialog = ref(false)
  const saveError = ref('')
  const combatForm = ref({  })
  const matchId = ref('')
  
  const onMatchClick = (eventMatchId) => {
    showDialog.value = true
    matchId.value = eventMatchId
  }
  
  const onParticipantClick = (participant, match) => {
    console.log("participant", participant) // team or feedIn
    console.log("match", match)
  }
  
  const { data: category } = useAsyncData('category', () =>
    fetcher(`/categ-champ/${categoryId}`)
  );

  const { data: registrations } = useAsyncData('registrations', () =>
    fetcher(`/registrations`)
  );

  const { data: rounds, refresh } = useAsyncData('pyramid', () =>
    fetcher(`/pyramid/${categoryId}`)
  );

  const cancel = () => {
    showDialog.value = false;
  };

  const saveItem = async () => {
    try {
      await fetcher(`/combat/${matchId.value}`, {
        method: 'PUT',
        body: combatForm.value
      });
      refresh()
      showDialog.value = false
    } catch (error) {
      console.error('Error al guardar los datos:', error); // Error handling
      saveError.value = 'Error al guardar los datos. Por favor, inténtelo de nuevo.'; // Set error message
    }
  };

  </script>