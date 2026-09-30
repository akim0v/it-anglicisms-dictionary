<script setup lang="ts">
import { ru } from '@nuxt/ui/locale'
</script>

<template>
  <UApp
    :locale="ru"
    :toaster="null"
  >
    <NuxtRouteAnnouncer />
    <AppHeader />
    <UMain>
      <NuxtPage />
    </UMain>
    <AboutFooter />
  </UApp>
</template>
