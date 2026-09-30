<script setup lang="ts">
const { stats } = useWords()

const description = [
  'Русская грамматика подчиняет заимствования:',
  `${countRu(stats.withVerbs, ['слово', 'слова', 'слов'])} из ${stats.total}`,
  `${pluralRu(stats.withVerbs, ['образовало', 'образовали', 'образовали'])} глаголы с русскими приставками,`,
  `${stats.declinable} ${pluralRu(stats.declinable, ['склоняется', 'склоняются', 'склоняются'])} по падежам.`
].join(' ')
</script>

<template>
  <UPageSection
    id="grammar"
    headline="Грамматика"
    title="Англицизмы живут по русским правилам"
    :description="description"
  >
    <div class="grid gap-6 lg:grid-cols-5 lg:items-start">
      <div class="min-w-0 lg:col-span-3">
        <h3 class="text-lg">
          Видовые пары глаголов
        </h3>
        <p class="mt-1 mb-4 text-sm text-muted">
          <span class="font-semibold text-primary">Синим</span> — англицизм,
          <span class="font-semibold text-secondary">малиновым</span> — русская приставка совершенного вида.
          Нажмите на слово, чтобы открыть статью.
        </p>
        <GrammarVerbTable />
      </div>
      <GrammarPrefixes class="lg:col-span-2" />
    </div>

    <GrammarFacts class="mt-6" />
  </UPageSection>
</template>
