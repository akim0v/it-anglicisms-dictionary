<script setup lang="ts">
import type { Word } from '~/types/word'

const props = defineProps<{
  word: Word
}>()

// У составных источников («back end», «team lead») нет отдельной страницы — ведём на поиск
const etymonlineUrl = computed(() => {
  const source = props.word.source.trim().toLowerCase()
  const encoded = encodeURIComponent(source)
  return source.includes(' ')
    ? `https://www.etymonline.com/search?q=${encoded}`
    : `https://www.etymonline.com/word/${encoded}`
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <p>{{ word.etymology }}</p>
    <div class="flex flex-wrap items-center gap-2">
      <UBadge
        v-if="word.etymologyVerified"
        color="neutral"
        variant="subtle"
        icon="i-lucide-badge-check"
        :ui="{ leadingIcon: 'text-success' }"
        label="сверено с Etymonline"
      />
      <UBadge
        v-else
        color="neutral"
        variant="outline"
        icon="i-lucide-circle-help"
        label="не сверено с Etymonline"
      />
      <ULink
        :to="etymonlineUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-sm underline underline-offset-2"
      >
        <span lang="en">{{ word.source }}</span> в Etymonline
        <UIcon
          name="i-lucide-external-link"
          class="size-3.5"
          aria-hidden="true"
        />
        <span class="sr-only">(откроется в новой вкладке)</span>
      </ULink>
    </div>
  </div>
</template>
