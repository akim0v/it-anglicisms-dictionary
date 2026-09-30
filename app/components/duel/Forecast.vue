<script setup lang="ts">
import type { Group } from '~/types/word'

/** Ф4: прогноз гипотезы над списком — для всех групп или для выбранной */
const props = defineProps<{
  group: Group | 'all'
  /** true — частот пока нет ни по одному источнику */
  pending: boolean
}>()

const groups = computed<Group[]>(() => (props.group === 'all' ? GROUPS : [props.group]))
</script>

<template>
  <div class="rounded-lg bg-elevated/50 p-4 ring ring-default sm:p-5">
    <p class="flex items-center gap-2 text-sm font-semibold text-highlighted">
      <UIcon
        name="i-lucide-lightbulb"
        class="size-4 shrink-0 text-muted"
        aria-hidden="true"
      />
      {{ group === 'all' ? 'Прогноз гипотезы по группам' : 'Прогноз гипотезы для группы' }}
    </p>
    <p
      v-if="pending"
      class="mt-1 text-sm text-muted"
    >
      Частоты по НКРЯ и Хабру ещё подсчитываются — пока сверяйтесь с прогнозом.
    </p>

    <ul
      class="mt-4 grid gap-3"
      :class="groups.length > 1 ? 'sm:grid-cols-3' : ''"
    >
      <li
        v-for="g in groups"
        :key="g"
        class="flex items-start gap-3"
      >
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          square
          class="w-8 justify-center font-display"
          :label="groupLetters[g]"
          aria-hidden="true"
        />
        <div class="min-w-0 text-sm">
          <p class="text-muted">
            <span class="sr-only">Группа {{ groupLetters[g] }}: </span>{{ groupLabels[g] }}
          </p>
          <p class="font-semibold text-highlighted">
            {{ groupForecasts[g] }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
