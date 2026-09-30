<script setup lang="ts">
import type { Word } from '~/types/word'

defineProps<{
  word: Word
}>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap gap-2">
      <UBadge
        color="neutral"
        variant="subtle"
      >
        Группа {{ groupLetters[word.group] }}: {{ groupLabels[word.group] }}
      </UBadge>
      <UBadge
        color="neutral"
        variant="outline"
        :label="assimilationLabels[word.assimilation]"
      />
      <UBadge
        color="neutral"
        variant="outline"
        icon="i-lucide-layers"
        :label="sphereLabels[word.sphere]"
      />
    </div>

    <WordArticleSection title="Значение">
      <p>{{ word.meaning }}</p>
    </WordArticleSection>

    <WordArticleSection title="Происхождение">
      <WordEtymology :word="word" />
    </WordArticleSection>

    <WordArticleSection title="Русский аналог">
      <p class="inline-flex items-center gap-2 text-base font-semibold text-secondary">
        <span
          class="size-2.5 shrink-0 rounded-full bg-secondary"
          aria-hidden="true"
        />
        {{ word.analog }}
      </p>
    </WordArticleSection>

    <WordArticleSection title="Род и склонение">
      <p>
        {{ genderLabels[word.gender] }},
        {{ word.declinable ? 'склоняется' : 'не склоняется' }}
      </p>
    </WordArticleSection>

    <WordArticleSection title="Глаголы">
      <p
        v-if="word.verbs"
        class="flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        <span>{{ word.verbs.imperfective }}</span>
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 text-muted"
          aria-hidden="true"
        />
        <span class="sr-only">совершенный вид:</span>
        <span class="font-semibold">{{ word.verbs.perfective }}</span>
        <UBadge
          color="neutral"
          variant="subtle"
          size="sm"
        >
          приставка {{ word.verbs.prefix }}
        </UBadge>
      </p>
      <p
        v-else
        class="text-muted"
      >
        нет глагольной пары
      </p>
    </WordArticleSection>

    <WordArticleSection title="Производные">
      <ul
        v-if="word.derivatives.length"
        class="flex flex-wrap gap-2"
      >
        <li
          v-for="d in word.derivatives"
          :key="d"
        >
          <UBadge
            color="neutral"
            variant="outline"
            :label="d"
          />
        </li>
      </ul>
      <p
        v-else
        class="text-muted"
      >
        нет
      </p>
    </WordArticleSection>

    <WordArticleSection title="Варианты написания">
      <ul
        v-if="word.variants.length"
        class="flex flex-wrap gap-2"
      >
        <li
          v-for="v in word.variants"
          :key="v"
        >
          <UBadge
            color="neutral"
            variant="outline"
            :label="v"
          />
        </li>
      </ul>
      <p
        v-else
        class="text-muted"
      >
        нет
      </p>
    </WordArticleSection>

    <WordArticleSection title="Частота употребления">
      <WordFrequencies :word="word" />
    </WordArticleSection>
  </div>
</template>
