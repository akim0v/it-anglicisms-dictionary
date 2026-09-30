<script setup lang="ts">
const { stats } = useWords()
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <h3 class="text-base">
        Варианты написания
      </h3>
      <p class="mt-1 text-sm text-muted">
        Написание ещё не устоялось у {{ countRu(stats.withVariants.length, ['слова', 'слов', 'слов']) }}.
      </p>
    </template>

    <ul class="space-y-2 text-sm">
      <li
        v-for="w in stats.withVariants"
        :key="w.id"
        class="flex flex-wrap items-baseline gap-x-2"
      >
        <GrammarWordLink :word="w" />
        <template
          v-for="variant in w.variants"
          :key="variant"
        >
          <span
            class="text-muted"
            aria-hidden="true"
          >—</span>
          <span class="text-default"><span class="sr-only">или </span>{{ variant }}</span>
        </template>
      </li>
    </ul>
  </UCard>
</template>
