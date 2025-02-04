<template>
  <div v-if="!rounds" >
    No se encontraron combates para la categoría seleccionada
  </div>
  <template v-else>
    <div>
      {{ category.championship.name }}
      {{ category.category?.sex }}
      {{ category.category?.categoriesAge?.name }}
      {{ category.category?.categoriesWeight?.name }}
      {{ category.category?.categoriesBeltGrade?.name }}
    </div>
    <TournamentBracket
      :rounds="rounds"
      @onMatchClick="onMatchClick"
      @onParticipantClick="onParticipantClick"
    />
  </template>
  
</template>

<script setup>
  import { TournamentBracket } from "vue3-tournament"
  import "vue3-tournament/style.css"
  const { fetcher } = useMacsApi();
  const route = useRoute()
  const categoryId = route.params.id;
  
  const onMatchClick = (matchId) => {
    console.log(`click: ${matchId}`)
  }
  
  const onParticipantClick = (participant, match) => {
    console.log("participant", participant) // team or feedIn
    console.log("match", match)
  }
  
  const { data: category } = useAsyncData('category', () =>
    fetcher(`/categ-champ/${categoryId}`)
  );


  const { data: rounds } = useAsyncData('pyramid', () =>
    fetcher(`/pyramid/${categoryId}`)
  );
  </script>