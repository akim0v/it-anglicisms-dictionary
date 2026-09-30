// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    experimental: {
      // CSS генерируется только для используемых компонентов Nuxt UI
      componentDetection: true
    }
  },

  runtimeConfig: {
    public: {
      // Итоговый адрес сайта на Vercel: задаётся через NUXT_PUBLIC_SITE_URL
      siteUrl: 'https://bug-ili-oshibka.vercel.app'
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-10-01',

  typescript: {
    strict: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    families: [
      { name: 'Unbounded', weights: [700], subsets: ['cyrillic', 'latin'], global: true },
      { name: 'Golos Text', weights: [400, 600], subsets: ['cyrillic', 'latin'], global: true }
    ]
  },

  icon: {
    // Все иконки встраиваются в бандл: на клиенте нет запросов к Iconify API
    clientBundle: {
      scan: {
        globInclude: ['**/*.{vue,ts}'],
        globExclude: ['node_modules', 'dist', '.nuxt', '.output']
      }
    },
    fallbackToApi: false
  }
})
