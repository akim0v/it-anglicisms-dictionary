<script setup lang="ts">
import type { Word } from '~/types/word'

const props = defineProps<{
  word: Word
}>()

const { openWord, wordHref } = useWordArticle()

/** Ctrl/Cmd/Shift-клик и средняя кнопка открывают ссылку как обычно (в новой вкладке) */
function onLinkClick(event: MouseEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  openWord(props.word.id)
}
</script>

<template>
  <UCard
    as="article"
    class="group/card relative h-full transition-colors hover:bg-elevated/50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary"
    :ui="{ root: 'flex flex-col', body: 'flex flex-1 flex-col gap-3' }"
  >
    <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <h3 class="text-lg text-primary">
        <!-- Растянутая ссылка: вся карточка кликабельна, в DOM — одна ссылка -->
        <a
          :href="wordHref(word.id)"
          class="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none"
          @click="onLinkClick"
        >{{ word.word }}</a>
      </h3>
      <span
        lang="en"
        class="text-sm text-muted"
      >{{ word.source }}</span>
    </div>

    <p class="text-sm">
      <span class="text-muted">Аналог:</span>
      <span class="ms-1 inline-flex items-center gap-1.5 font-semibold text-secondary">
        <span
          class="size-2 shrink-0 rounded-full bg-secondary"
          aria-hidden="true"
        />
        {{ word.analog }}
      </span>
    </p>

    <p class="flex-1 text-sm text-toned">
      {{ word.meaning }}
    </p>

    <!-- Бейджи над растянутой ссылкой ради подсказки; клик мышью всё равно открывает статью -->
    <div
      class="relative z-10 flex cursor-pointer flex-wrap gap-2"
      @click="openWord(word.id)"
    >
      <UTooltip :text="groupLabels[word.group]">
        <UBadge
          color="neutral"
          variant="subtle"
        >
          Группа {{ groupLetters[word.group] }}<span class="sr-only">: {{ groupLabels[word.group] }}</span>
        </UBadge>
      </UTooltip>
      <UBadge
        color="neutral"
        variant="outline"
        :label="assimilationLabels[word.assimilation]"
      />
    </div>
  </UCard>
</template>
