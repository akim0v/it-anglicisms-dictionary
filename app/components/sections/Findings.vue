<script setup lang="ts">
const { stats } = useWords()
</script>

<template>
  <UPageSection
    id="findings"
    headline="Выводы"
    title="Что показало исследование"
    :description="`Гипотеза исследования: исход конкуренции англицизма с русским аналогом зависит от типа аналога. Грамматическую сторону проверяем на всех словах словаря (${stats.total}) — по доле англицизмов, образующих глаголы с видовыми парами.`"
    :ui="{ container: 'lg:py-24', body: 'mt-10 sm:mt-12 space-y-12 max-w-4xl mx-auto w-full min-w-0' }"
  >
    <template #body>
      <div>
        <h3 class="mb-4 text-lg text-highlighted sm:text-xl">
          Проверка гипотезы по группам
        </h3>
        <FindingsHypothesisTable />
      </div>

      <div>
        <h3 class="mb-4 text-lg text-highlighted sm:text-xl">
          Итоги исследования
        </h3>
        <FindingsSummary />
      </div>
    </template>
  </UPageSection>
</template>
