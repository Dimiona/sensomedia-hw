import dotenv from "dotenv";

const configOutput = dotenv.config({
  path: '../../.env'
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  experimental: {
    appManifest: false
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: configOutput.parsed?.API_URL,
    }
  }
})
