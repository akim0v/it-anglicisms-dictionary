<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import type { Word } from '~/types/word'

const { activeWord, closeWord } = useWordArticle()
const appConfig = useAppConfig()

// Хеш адреса известен только в браузере: открываем панель после монтирования (Ф13)
const mounted = useMounted()

const open = computed({
  get: () => mounted.value && activeWord.value !== null,
  set: (value: boolean) => {
    if (!value) closeWord()
  }
})

// Последнее открытое слово остаётся на время анимации закрытия
const word = ref<Word | null>(null)
watch(activeWord, (value) => {
  if (value) word.value = value
}, { immediate: true })

// Панель открывается не через DialogTrigger, поэтому Reka не знает, куда вернуть фокус.
// Запоминаем элемент, с которого открыли статью (ссылку карточки, пару дуэли…), и возвращаем фокус на него.
let returnFocusTo: HTMLElement | null = null
watch(open, (isOpen) => {
  if (!isOpen) return
  const active = document.activeElement
  returnFocusTo = active instanceof HTMLElement && active !== document.body ? active : null
})

function onCloseAutoFocus(event: Event) {
  if (!returnFocusTo?.isConnected) return
  event.preventDefault()
  returnFocusTo.focus()
  returnFocusTo = null
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="word?.word ?? 'Словарная статья'"
    description="Словарная статья"
    :content="{ onCloseAutoFocus }"
    :ui="{ content: 'max-w-lg', wrapper: 'min-w-0 pe-10', title: 'text-2xl text-primary font-display' }"
  >
    <template #close="{ ui }">
      <UButton
        :icon="appConfig.ui.icons.close"
        color="neutral"
        variant="ghost"
        aria-label="Закрыть статью"
        :class="ui.close()"
      />
    </template>

    <template #description>
      <span v-if="word">
        от англ. <span
          lang="en"
          class="font-semibold"
        >{{ word.source }}</span>
      </span>
    </template>

    <template #body>
      <WordArticleBody
        v-if="word"
        :word="word"
      />
    </template>
  </USlideover>
</template>
