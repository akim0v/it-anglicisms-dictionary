<script setup lang="ts">
import type { FrequencySource, Word } from '~/types/word'

const props = defineProps<{
  word: Word
  /** Выбранный источник частот; null — данных нет ни по одному источнику */
  source: FrequencySource | null
  revealed: boolean
  animated: boolean
  /** Показать букву группы (во вкладке «Все») */
  showGroup?: boolean
}>()

const { openWord, wordHref } = useWordArticle()

const share = computed(() => (props.source ? getShare(props.word.frequency[props.source]) : null))
const percent = computed(() => (share.value === null ? null : Math.round(share.value * 100)))
// Вердикт — по той же округлённой доле, что видна на экране: 59,6% → «60%» и «Побеждает англицизм»
const verdict = computed(() => (percent.value === null ? null : getVerdict(percent.value / 100)))

const verdictColor = computed(() => {
  if (verdict.value === 'anglicism') return 'primary'
  if (verdict.value === 'analog') return 'secondary'
  return 'neutral'
})
</script>

<template>
  <li
    class="group/row relative grid grid-cols-1 gap-2 rounded-lg px-3 py-3 transition-colors hover:bg-elevated/60 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_15rem] md:items-center md:gap-4"
  >
    <!-- Подписи над полосой на телефоне и слева от неё на широком экране -->
    <a
      :href="wordHref(word.id)"
      class="min-w-0 font-semibold after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none"
      @click.prevent="openWord(word.id)"
    >
      <span
        v-if="showGroup"
        class="mr-2 inline-flex size-6 items-center justify-center rounded-md align-middle font-display text-xs text-muted ring ring-default"
      ><span class="sr-only">Группа </span>{{ groupLetters[word.group] }}<span class="sr-only">: </span></span>
      <span class="text-primary underline-offset-4 group-hover/row:underline">{{ word.word }}</span>
      <span class="text-muted"> — </span>
      <span class="text-secondary">{{ word.analog }}</span>
      <span class="sr-only">: открыть словарную статью</span>
    </a>

    <DuelBar
      :anglicism="word.word"
      :analog="word.analog"
      :share="share"
      :revealed="revealed"
      :animated="animated"
    />

    <div class="flex min-h-6 items-center justify-between gap-2 text-sm md:justify-end">
      <template v-if="percent !== null && verdict !== null">
        <span
          class="tabular-nums"
          aria-hidden="true"
        >
          <span class="font-semibold text-primary">{{ percent }}%</span>
          <span class="text-muted"> / </span>
          <span class="font-semibold text-secondary">{{ 100 - percent }}%</span>
        </span>
        <UBadge
          :color="verdictColor"
          variant="subtle"
          class="shrink-0"
          :label="verdictLabels[verdict]"
        />
      </template>
      <span
        v-else
        class="inline-flex items-center gap-1.5 text-muted"
      >
        <UIcon
          name="i-lucide-hourglass"
          class="size-4 shrink-0"
          aria-hidden="true"
        />
        {{ NO_DATA_LABEL }}
      </span>
    </div>
  </li>
</template>
