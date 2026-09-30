<script setup lang="ts">
import type { Gender } from '~/types/word'

const { stats } = useWords()

const genitive: Record<Gender, string> = {
  m: 'мужского рода',
  f: 'женского рода',
  n: 'среднего рода'
}

const indeclinable = stats.indeclinable
const indeclinableGenders = [...new Set(indeclinable.map(w => w.gender))]

/** «Оба — среднего рода»: вывод делается из данных, а не утверждается заранее */
const commonGenderNote = (() => {
  const [gender] = indeclinableGenders
  if (indeclinableGenders.length !== 1 || !gender || indeclinable.length < 2) return null
  const all = indeclinable.length === 2 ? (gender === 'f' ? 'Обе' : 'Оба') : 'Все'
  const tail = gender === 'n' ? ', как и другие несклоняемые заимствования: кафе, пальто, метро' : ''
  return `${all} — ${genitive[gender]}${tail}.`
})()
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <h3 class="text-base">
        Склонение
      </h3>
      <p class="mt-1 text-sm text-muted">
        Англицизмы меняются по падежам, как исконные русские слова.
      </p>
    </template>

    <p class="flex items-baseline gap-3">
      <span class="font-display text-4xl text-primary">{{ stats.declinable }}</span>
      <span class="text-sm text-default">
        из {{ stats.total }} {{ pluralRu(stats.total, ['слова', 'слов', 'слов']) }}
        {{ pluralRu(stats.declinable, ['склоняется', 'склоняются', 'склоняются']) }}
      </span>
    </p>

    <div
      v-if="indeclinable.length"
      class="mt-5 border-t border-default pt-4"
    >
      <p class="text-sm text-default">
        {{ countRu(indeclinable.length, ['несклоняемое слово', 'несклоняемых слова', 'несклоняемых слов']) }}:
      </p>
      <ul class="mt-2 space-y-1.5">
        <li
          v-for="w in indeclinable"
          :key="w.id"
          class="flex flex-wrap items-center gap-2 text-sm"
        >
          <GrammarWordLink :word="w" />
          <UBadge
            color="neutral"
            variant="subtle"
            :label="genderLabels[w.gender]"
          />
        </li>
      </ul>
      <p
        v-if="commonGenderNote"
        class="mt-3 text-sm text-muted"
      >
        {{ commonGenderNote }}
      </p>
    </div>
  </UCard>
</template>
