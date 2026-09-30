<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useMounted } from '@vueuse/core'

const route = useRoute()
const router = useRouter()

// Ссылки на секции сохраняют ?q=…&group=… словаря. Запрос подставляется
// только после монтирования: страница пререндерится без него.
const mounted = useMounted()
const query = computed(() => (mounted.value ? route.query : {}))

const topHref = computed(() => router.resolve({ query: query.value, hash: '#top' }).href)

const items = computed<NavigationMenuItem[]>(() =>
  SECTIONS.map(section => ({
    label: section.label,
    to: { query: query.value, hash: `#${section.id}` },
    active: mounted.value && route.hash === `#${section.id}`
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
