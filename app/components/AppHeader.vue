<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

// Ссылки на секции сохраняют ?q=…&group=… словаря
const topHref = computed(() => router.resolve({ query: route.query, hash: '#top' }).href)

const items = computed<NavigationMenuItem[]>(() =>
  SECTIONS.map(section => ({
    label: section.label,
    to: { query: route.query, hash: `#${section.id}` },
    active: route.hash === `#${section.id}`
  }))
)
</script>

<template>
  <UHeader
    title="Баг или ошибка?"
    :to="topHref"
    mode="slideover"
    :menu="{ title: 'Разделы' }"
  >
    <template #title>
      <span class="font-display text-base sm:text-lg">
        <span class="text-primary">Баг</span>
        <span class="text-muted"> или </span>
        <span class="text-secondary">ошибка?</span>
      </span>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
