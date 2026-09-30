<script setup lang="ts">
const { q, group, assimilation, sphere, sort, results, total, isFiltered, isDefault, reset } = useDictionaryFilters()

const description = `${countRu(total, ['англицизм', 'англицизма', 'англицизмов'])} с источником, русским аналогом, значением и степенью освоения. Нажмите на карточку, чтобы открыть полную словарную статью.`

const filters = useTemplateRef('filters')

/** Кнопка «Сбросить фильтры» исчезает вместе с пустым состоянием — фокус переводим в поиск */
function resetFromEmpty() {
  reset()
  filters.value?.focusSearch()
}
</script>

<template>
  <UPageSection
    id="dictionary"
    headline="Словарь"
    title="Все слова исследования"
    :description="description"
    :ui="{ container: 'lg:py-24' }"
  >
    <div class="flex flex-col gap-8">
      <DictionaryFilters
        ref="filters"
        v-model:q="q"
        v-model:group="group"
        v-model:assimilation="assimilation"
        v-model:sphere="sphere"
        v-model:sort="sort"
        :found="results.length"
        :total="total"
        :can-reset="!isDefault"
        @reset="reset"
      />

      <ul
        v-if="results.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Слова словаря"
      >
        <li
          v-for="w in results"
          :key="w.id"
        >
          <DictionaryCard :word="w" />
        </li>
      </ul>

      <div
        v-else
        class="flex flex-col items-center gap-4 rounded-lg border border-dashed border-default px-4 py-12 text-center"
      >
        <UIcon
          name="i-lucide-search-x"
          class="size-8 text-muted"
          aria-hidden="true"
        />
        <p class="text-lg font-semibold text-highlighted">
          Ничего не нашлось
        </p>
        <p
          v-if="isFiltered"
          class="text-sm text-muted"
        >
          Попробуйте другое написание или уберите часть фильтров.
        </p>
        <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-rotate-ccw"
          label="Сбросить фильтры"
          @click="resetFromEmpty"
        />
      </div>
    </div>
  </UPageSection>
</template>
