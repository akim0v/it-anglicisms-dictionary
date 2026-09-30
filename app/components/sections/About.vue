<script setup lang="ts">
import { PROJECT_TITLE } from '~/data/project'
</script>

<template>
  <UPageSection
    id="about"
    headline="О проекте"
    title="Как мы исследовали"
    :description="`Сайт — практическая часть проекта «${PROJECT_TITLE}»: цель, методы и источники исследования.`"
    :ui="{ container: 'lg:py-24', body: 'mt-10 sm:mt-12 max-w-3xl mx-auto w-full min-w-0 space-y-10' }"
  >
    <template #body>
      <AboutDetails />
      <AboutCredits />
    </template>
  </UPageSection>
</template>
