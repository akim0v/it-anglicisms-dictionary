<script setup lang="ts">
import type { Assimilation } from '~/types/word'

const props = defineProps<{ assimilation: Assimilation }>()

const { words, stats } = useWords()
const { openWord, wordHref } = useWordArticle()

const collator = new Intl.Collator('ru')

/** Что означает степень освоения — по одной строке на колонку */
const explanations: Record<Assimilation, string> = {
  full: 'Вышли за пределы IT: понятны широкому кругу носителей и звучат как обычные русские слова.',
  professional: 'Живут в речи айтишников: подчиняются русской грамматике, но вне профессии малопонятны.',
  partial: 'Сохраняют чужие черты: не склоняются или колеблются в написании.'
}

/** Чем полнее освоение, тем «плотнее» бейдж */
const badgeVariants = {
  full: 'solid',
  professional: 'subtle',
  partial: 'outline'
} as const satisfies Record<Assimilation, 'solid' | 'subtle' | 'outline'>

const list = computed(() =>
  words
    .filter(w => w.assimilation === props.assimilation)
    .sort((a, b) => collator.compare(a.word, b.word))
)
const count = computed(() => stats.byAssimilation[props.assimilation])
const headingId = computed(() => `assimilation-${props.assimilation}`)
</script>

<template>
  <UCard
    as="article"
    class="h-full"
    :aria-labelledby="headingId"
  >
    <template #header>
      <!-- Заголовок на всю ширину: «Профессионализмы» шрифтом Unbounded не помещается рядом с числом -->
      <h3
        :id="headingId"
        class="text-lg hyphens-auto break-words"
      >
        {{ assimilationPluralLabels[props.assimilation] }}
      </h3>
      <p class="mt-1 flex items-baseline gap-2">
        <span class="font-display text-3xl text-primary">{{ count }}</span>
        <span class="text-sm text-muted">{{ pluralRu(count, ['слово', 'слова', 'слов']) }}</span>
      </p>
      <p class="mt-2 text-sm text-muted">
        {{ explanations[props.assimilation] }}
      </p>
    </template>

    <ul class="flex flex-wrap gap-2">
      <li
        v-for="w in list"
        :key="w.id"
      >
        <UBadge
          as="a"
          :href="wordHref(w.id)"
          color="primary"
          :variant="badgeVariants[props.assimilation]"
          size="lg"
          :label="w.word"
          class="cursor-pointer hover:underline hover:underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          @click.prevent="openWord(w.id)"
        />
      </li>
    </ul>
  </UCard>
</template>
