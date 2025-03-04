// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],
  runtimeConfig:{
    public:{
      baseURL: process.env.BASE_URL || 'http://localhost:8080'
    }
  },
  ssr: false
})