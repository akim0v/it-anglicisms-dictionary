<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { HypothesisRow } from '~/composables/useWords'

const { stats } = useWords()

const percent = (share: number) => `${Math.round(share * 100)}%`
const totalShare = stats.total ? stats.withVerbs / stats.total : 0

const numeric = { class: { th: 'text-right', td: 'text-right tabular-nums' } }

const columns: TableColumn<HypothesisRow>[] = [
  { accessorKey: 'group', header: 'Группа', footer: 'Все слова' },
  { accessorKey: 'total', header: 'Слов в группе', footer: String(stats.total), meta: numeric },
  { accessorKey: 'withVerbs', header: 'С глаголами', footer: String(stats.withVerbs), meta: numeric },
  {
    accessorKey: 'share',
    header: 'Доля',
    footer: percent(totalShare),
    meta: { class: { th: 'text-right', td: 'sm:min-w-56' } }
  }
]
</script>

<template>
  <UTable
    :data="stats.hypothesis"
    :columns="columns"
    caption="Доля англицизмов, образующих русские глаголы с видовыми парами, по группам"
    :ui="{
      root: 'rounded-lg border border-default',
      caption: 'sr-only',
      th: 'px-2 text-xs sm:px-4 sm:text-sm',
      td: 'px-2 py-3 text-default sm:p-4'
    }"
  >
    <template #group-cell="{ row }">
      <div class="flex items-center gap-2 sm:gap-3">
        <span
          class="grid size-7 sm:size-8 shrink-0 place-items-center rounded-md bg-elevated font-display text-sm text-highlighted"
          aria-hidden="true"
        >
          {{ groupLetters[row.original.group] }}
        </span>
        <span class="whitespace-normal text-xs hyphens-auto sm:text-sm sm:hyphens-manual">
          <span class="sr-only">Группа {{ groupLetters[row.original.group] }}: </span>
          {{ groupLabels[row.original.group] }}
        </span>
      </div>
    </template>

    <template #share-cell="{ row }">
      <div class="flex items-center justify-end gap-3">
        <div
          class="hidden h-2 flex-1 overflow-hidden rounded-full bg-accented sm:block"
          aria-hidden="true"
        >
          <div
            class="h-full rounded-full bg-primary"
            :style="{ width: percent(row.original.share) }"
          />
        </div>
        <span class="w-10 text-right font-semibold tabular-nums text-highlighted">
          {{ percent(row.original.share) }}
        </span>
      </div>
    </template>
  </UTable>
</template>
