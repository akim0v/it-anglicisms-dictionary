<script setup lang="ts">
import type { VerbPair } from '~/types/word'

const props = defineProps<{ verbs: VerbPair }>()

/** Разбивает «закоммитить» на приставку «за» и основу «коммитить» */
const parts = computed(() => {
  const prefix = props.verbs.prefix.replace(/-$/, '')
  const { perfective } = props.verbs
  return perfective.startsWith(prefix)
    ? { prefix, rest: perfective.slice(prefix.length) }
    : { prefix: '', rest: perfective }
})
</script>

<template>
  <span class="text-highlighted">
    <!-- Скринридер читает слово целиком, а не «за» + «коммитить» -->
    <span class="sr-only">{{ props.verbs.perfective }}</span>
    <span aria-hidden="true"><b
      v-if="parts.prefix"
      class="font-bold text-secondary"
    >{{ parts.prefix }}</b>{{ parts.rest }}</span>
  </span>
</template>
