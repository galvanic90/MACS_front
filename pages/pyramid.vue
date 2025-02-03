<template>
    <TournamentBracket
      :rounds="rounds"
      @onMatchClick="onMatchClick"
      @onParticipantClick="onParticipantClick"
    />
  </template>
  
  <script lang="ts" setup>
  import { TournamentBracket } from "vue3-tournament"
  import type IRound from "vue3-tournament/interface/IRound"
  import "vue3-tournament/style.css"
  
  const onMatchClick = (matchId: string | number): void => {
    alert(`click: ${matchId}`)
  }
  
  const onParticipantClick = (participant: any, match: any): void => {
    console.log("participant", participant) // team or feedIn
    console.log("match", match)
  }
  
  const rounds = ref<IRound[]>([
  {
    "matchs": [
      {
        "title": "combate 1",
        "id": "match1",
        "winner": "1",
        "team1": {
          "id": "1",
          "name": "Competitor 1",
          "score": 2
        },
        "team2": {
          "id": "2",
          "name": "Competitor 2",
          "score": 1
        }
      },
      {
        "title": "paso directo",
        "id": "match2",
        "feedIn": {
          "id": "3",
          "name": "Competitor 3"
        }
      }
    ]
  },
  {
    "matchs": [
      {
        "title": "combate 2",
        "id": "match3",
        "team1": {
          "id": "1",
          "name": "Competitor 1"
        },
        "team2": {
          "id": "3",
          "name": "Competitor 3"
        }
      },
      {
        "id": "match4",
        "feedIn": {
          "id": "4",
          "name": "Competitor 4"
        }
      }
    ]
  },
  {
    "matchs": [
      {
        "id": "any_match_id",
        title: "combate 3",
        "team1": {
            "id": "",
            "name": "Combate 2 **"
        },
        "team2": {
          "id": "4",
          "name": "Competidor 4",
        }
      }
    ]
  }
])
  </script>