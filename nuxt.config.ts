// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // SPA Mode for fast client-side performance and direct local execution
  css: [
    '~/assets/css/main.css'
  ],
  compatibilityDate: '2026-07-17',
  devtools: { enabled: true }
})
