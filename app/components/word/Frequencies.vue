<script setup lang="ts">
import type { Word } from '~/types/word'
import { getShare, getVerdict } from '~/composables/useWords'

const props = defineProps<{
  word: Word
}>()

const numberFormat = new Intl.NumberFormat('ru')
const format = (value: number | null) => (value === null ? '—' : numberFormat.format(value))

const rows = computed(() =>
  FREQUENCY_SOURCES.map((source) => {
    const pair = props.word.frequency[source]
    const share = getShare(pair)
    const percent = share === null ? null : Math.round(share * 100)
    return {
      source,
      label: frequencySourceLabels[source],
      pair,
      percent,
      verdict: share === null ? null : verdictLabels[getVerdict(share)]
    }
  })
)
</script>

<template>
  <ul class="flex flex-col gap-4">
    <li
      v-for="row in rows"
      :key="row.source"
      class="flex flex-col gap-2"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span class="font-semibold text-highlighted">{{ row.label }}</span>
        <span
          v-if="row.verdict"
          class="text-sm font-semibold"
        >{{ row.verdict }}</span>
        <span
          v-else
          class="text-sm text-muted"
        >{{ NO_DATA_LABEL }}</span>
      </div>

      <template v-if="row.percent !== null">
        <div
          class="flex h-2.5 overflow-hidden rounded-full bg-elevated"
          role="img"
          :aria-label="`${word.word} ${row.percent}%, ${word.analog} ${100 - row.percent}%`"
        >
          <div
            class="bg-primary"
            :style="{ width: `${row.percent}%` }"
          />
          <div
            class="bg-secondary"
            :style="{ width: `${100 - row.percent}%` }"
          />
        </div>
        <dl class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt class="text-primary font-semibold">
              {{ word.word }}
            </dt>
            <dd class="text-muted">
              {{ format(row.pair.anglicism) }} · {{ row.percent }}%
            </dd>
          </div>
          <div class="text-end">
            <dt class="text-secondary font-semibold">
              {{ word.analog }}
            </dt>
            <dd class="text-muted">
              {{ format(row.pair.analog) }} · {{ 100 - row.percent }}%
            </dd>
          </div>
        </dl>
      </template>
      <div
        v-else
        class="h-2.5 rounded-full bg-elevated"
        aria-hidden="true"
      />
    </li>
  </ul>
</template>
