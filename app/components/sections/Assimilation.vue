<script setup lang="ts">
const { stats } = useWords()

const description = ASSIMILATIONS
  .map(a => `${assimilationPluralLabels[a].toLocaleLowerCase('ru')} — ${stats.byAssimilation[a]}`)
  .join(', ')
</script>

<template>
  <UPageSection
    id="assimilation"
    headline="Степень освоения"
    title="Насколько слово стало своим"
    :description="`Все ${stats.total} ${pluralRu(stats.total, ['слово', 'слова', 'слов'])} по степени освоения: ${description}. Нажмите на слово, чтобы открыть статью.`"
  >
    <div class="grid gap-6 lg:grid-cols-3">
      <AssimilationColumn
        v-for="a in ASSIMILATIONS"
        :key="a"
        :assimilation="a"
      />
    </div>
  </UPageSection>
</template>
