<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { VerbPair, Word } from '~/types/word'

interface VerbRow {
  id: string
  word: Word
  verbs: VerbPair
  prefix: string
  prefixCount: number
  /** Первая строка группы: в ней стоит объединённая ячейка приставки */
  first: boolean
}

const { stats } = useWords()
const collator = new Intl.Collator('ru')

// Строки идут группами по приставкам в порядке stats.prefixes (от частых к редким)
const rows: VerbRow[] = stats.prefixes.flatMap(({ prefix, count, words }) =>
  [...words]
    .sort((a, b) => collator.compare(a.word, b.word))
    .flatMap((word, index) => word.verbs
      ? [{ id: word.id, word, verbs: word.verbs, prefix, prefixCount: count, first: index === 0 }]
      : [])
)

const columns: TableColumn<VerbRow>[] = [
  {
    accessorKey: 'prefix',
    header: 'Приставка',
    meta: {
      rowspan: { td: cell => (cell.row.original.first ? String(cell.row.original.prefixCount) : '1') },
      class: { td: cell => (cell.row.original.first ? 'align-top border-e border-default bg-elevated/40' : 'hidden') }
    }
  },
  { id: 'noun', header: 'Существительное' },
  { id: 'imperfective', header: 'Несов. вид' },
  { id: 'perfective', header: 'Сов. вид' }
]

const caption = `Видовые пары глаголов от англицизмов по приставкам совершенного вида, всего ${countRu(stats.withVerbs, ['глагол', 'глагола', 'глаголов'])}`

const tableUi = {
  th: 'px-3 sm:px-4',
  td: 'px-3 py-3 sm:px-4'
}
</script>

<template>
  <UTable
    :data="rows"
    :columns="columns"
    :ui="tableUi"
    :caption="caption"
    role="region"
    tabindex="0"
    aria-label="Видовые пары глаголов"
    class="rounded-lg ring ring-default"
  >
    <template #imperfective-header>
      <span aria-hidden="true">Несов. вид</span><span class="sr-only">Несовершенный вид</span>
    </template>
    <template #perfective-header>
      <span aria-hidden="true">Сов. вид</span><span class="sr-only">Совершенный вид</span>
    </template>
    <template #prefix-cell="{ row }">
      <span class="block font-display text-lg text-secondary">{{ row.original.prefix }}</span>
      <span class="text-xs text-muted">{{ countRu(row.original.prefixCount, ['глагол', 'глагола', 'глаголов']) }}</span>
    </template>
    <template #noun-cell="{ row }">
      <GrammarWordLink :word="row.original.word" />
    </template>
    <template #imperfective-cell="{ row }">
      <span class="text-default">{{ row.original.verbs.imperfective }}</span>
    </template>
    <template #perfective-cell="{ row }">
      <GrammarPerfectiveVerb :verbs="row.original.verbs" />
    </template>
  </UTable>
</template>
