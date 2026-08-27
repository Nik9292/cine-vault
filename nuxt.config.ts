// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon'],
  devtools: { enabled: true },

  css: ['~/assets/styles/main.scss'],

  runtimeConfig: {
    tmdbApiKey: '',
    tmdbAccessToken: '',
  },
  compatibilityDate: '2025-07-15',

  eslint: {
    config: {
      stylistic: true,
    },
  },
  fonts: {
    families: [
      {
        name: 'Manrope',
        provider: 'google',
        weights: ['400 700'],
        styles: ['normal'],
        subsets: ['cyrillic', 'latin'],
        global: true,
      },
    ],
  },
})
