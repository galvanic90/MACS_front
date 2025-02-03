<template>
  <div v-if="!rounds" >
    No se encontraron combates para la categoría seleccionada
  </div>
  <template v-else>
    <TournamentBracket
      :rounds="rounds"
      @onMatchClick="onMatchClick"
      @onParticipantClick="onParticipantClick"
    />
  </template>
  
</template>

<script lang="ts" setup>
  import { TournamentBracket } from "vue3-tournament"
  import type IRound from "vue3-tournament/interface/IRound"
  import "vue3-tournament/style.css"
  const { fetcher } = useMacsApi();
  const category = useState();
  
  const onMatchClick = (matchId: string | number): void => {
    alert(`click: ${matchId}`)
  }
  
  const onParticipantClick = (participant: any, match: any): void => {
    console.log("participant", participant) // team or feedIn
    console.log("match", match)
  }
  
  const { data: rounds } = useAsyncData('categories', () =>
    fetcher('/pyramid/2')
  );
  </script>