<script setup lang="ts">
import type { Word } from '~/types/word'

const props = defineProps<{ word: Word }>()

const { openWord, wordHref } = useWordArticle()
</script>

<template>
  <a
    :href="wordHref(props.word.id)"
    class="rounded-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    @click.prevent="openWord(props.word.id)"
  >
    <slot>{{ props.word.word }}</slot>
  </a>
</template>
