<script setup lang="ts">
import type { Gender } from '~/types/word'

const { stats, words } = useWords()

const GENDERS: Gender[] = ['m', 'f', 'n']
const genitive: Record<Gender, string> = {
  m: 'мужского рода',
  f: 'женского рода',
  n: 'среднего рода'
}
/** Небольшие группы показываем списком слов */
const LIST_LIMIT = 5

const rows = GENDERS.map(gender => ({
  gender,
  count: stats.gender[gender],
  label: genitive[gender],
  words: words.filter(w => w.gender === gender)
})).filter(row => row.count > 0)
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <h3 class="text-base">
        Род
      </h3>
      <p class="mt-1 text-sm text-muted">
        Заимствование получает род по звучанию: на согласный — мужской, на -а — женский.
      </p>
    </template>

    <ul class="space-y-4">
      <li
        v-for="row in rows"
        :key="row.gender"
        class="flex gap-3"
      >
        <span class="min-w-10 shrink-0 text-right font-display text-2xl text-highlighted">{{ row.count }}</span>
        <div class="min-w-0 text-sm">
          <p class="text-default">
            {{ pluralRu(row.count, ['слово', 'слова', 'слов']) }} {{ row.label }}
          </p>
          <p
            v-if="row.words.length <= LIST_LIMIT"
            class="mt-0.5 flex flex-wrap gap-x-3"
          >
            <GrammarWordLink
              v-for="w in row.words"
              :key="w.id"
              :word="w"
            />
          </p>
        </div>
      </li>
    </ul>
  </UCard>
</template>
