<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import { PROJECT_GOAL, PROJECT_METHODS, PROJECT_SOURCES, type ProjectMethodId } from '~/data/project'

const { words, stats, hasFrequencyData } = useWords()

const verified = words.filter(w => w.etymologyVerified).length
const readySources = FREQUENCY_SOURCES.filter(source => hasFrequencyData(source))

/** Цифры к каждому методу — из данных, а не вручную */
const methodNotes: Record<ProjectMethodId, string> = {
  sample: `Слов в словаре: ${stats.total}`,
  groups: `По группам: ${GROUPS.map(g => `${groupLetters[g]} — ${stats.byGroup[g]}`).join(', ')}`,
  etymology: `Сверено с Etymonline: ${verified} из ${stats.total}`,
  grammar: `Склоняются: ${stats.declinable} из ${stats.total}; с видовыми парами: ${stats.withVerbs}`,
  frequency: readySources.length
    ? `Данные внесены: ${readySources.map(s => frequencySourceLabels[s]).join(', ')}`
    : NO_DATA_LABEL
}

const items = [
  { label: 'Цель', icon: 'i-lucide-target', value: 'goal', slot: 'goal' as const },
  { label: 'Методы', icon: 'i-lucide-microscope', value: 'methods', slot: 'methods' as const },
  { label: 'Источники', icon: 'i-lucide-library', value: 'sources', slot: 'sources' as const }
] satisfies AccordionItem[]
</script>

<template>
  <UAccordion
    :items="items"
    type="multiple"
    :default-value="['goal']"
    :unmount-on-hide="false"
    :ui="{ trigger: 'text-base py-4', leadingIcon: 'text-primary' }"
  >
    <template #goal-body>
      <p class="text-base leading-relaxed text-default">
        {{ PROJECT_GOAL }}
      </p>
    </template>

    <template #methods-body>
      <ol class="space-y-4">
        <li
          v-for="method in PROJECT_METHODS"
          :key="method.id"
          class="flex gap-3"
        >
          <UIcon
            :name="method.icon"
            class="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p class="font-semibold text-highlighted">
              {{ method.title }}
            </p>
            <p class="mt-1 text-default">
              {{ method.description }}
            </p>
            <p class="mt-1 text-muted">
              {{ methodNotes[method.id] }}
            </p>
          </div>
        </li>
      </ol>
    </template>

    <template #sources-body>
      <ul class="space-y-3">
        <li
          v-for="source in PROJECT_SOURCES"
          :key="source.title"
        >
          <ULink
            v-if="source.url"
            :to="source.url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:text-primary hover:underline"
          >
            {{ source.title }}
            <UIcon
              name="i-lucide-external-link"
              class="size-4 shrink-0"
              aria-hidden="true"
            />
            <span class="sr-only">(откроется в новой вкладке)</span>
          </ULink>
          <span
            v-else
            class="font-semibold text-highlighted"
          >{{ source.title }}</span>
          <p class="mt-0.5 text-muted">
            {{ source.description }}
          </p>
        </li>
      </ul>
    </template>
  </UAccordion>
</template>
