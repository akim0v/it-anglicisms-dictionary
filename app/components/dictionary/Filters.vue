<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import type { Assimilation, Group, Sphere } from '~/types/word'
import type { SortMode } from '~/composables/useWords'

defineProps<{
  found: number
  total: number
  canReset: boolean
}>()

const emit = defineEmits<{
  reset: []
}>()

const q = defineModel<string>('q', { required: true })
const group = defineModel<Group | null>('group', { required: true })
const assimilation = defineModel<Assimilation | null>('assimilation', { required: true })
const sphere = defineModel<Sphere | null>('sphere', { required: true })
const sort = defineModel<SortMode>('sort', { required: true })

const searchInput = useTemplateRef('searchInput')

function focusSearch() {
  searchInput.value?.inputRef?.focus()
}

function clearSearch() {
  q.value = ''
  // Кнопка очистки исчезает — возвращаем фокус в поле, чтобы он не терялся
  focusSearch()
}

function onReset() {
  emit('reset')
  // Кнопка «Сбросить» становится неактивной и теряет фокус — переводим его в поиск
  focusSearch()
}

defineExpose({ focusSearch })

/** Reka Select не принимает пустое значение, поэтому «Все» — отдельный ключ */
const ALL = 'all'

function withAll<T extends string>(model: Ref<T | null>, allowed: readonly T[]) {
  return computed<string>({
    get: () => model.value ?? ALL,
    set: (value) => {
      model.value = (allowed as readonly string[]).includes(value) ? (value as T) : null
    }
  })
}

const groupValue = withAll(group, GROUPS)
const assimilationValue = withAll(assimilation, ASSIMILATIONS)
const sphereValue = withAll(sphere, SPHERES)

const groupItems: SelectItem[] = [
  { label: 'Все группы', value: ALL },
  // В поле видна короткая подпись, расшифровка группы — в выпадающем списке
  ...GROUPS.map(g => ({ label: `Группа ${groupLetters[g]}`, description: groupLabels[g], value: g }))
]
const assimilationItems: SelectItem[] = [
  { label: 'Любая', value: ALL },
  ...ASSIMILATIONS.map(a => ({ label: assimilationLabels[a], value: a }))
]
const sphereItems: SelectItem[] = [
  { label: 'Все сферы', value: ALL },
  ...SPHERES.map(s => ({ label: sphereLabels[s], value: s }))
]
const sortItems: { label: string, value: SortMode }[] = [
  { label: 'По алфавиту', value: 'alpha' },
  { label: 'По группе', value: 'group' },
  { label: 'По степени освоения', value: 'assimilation' }
]
</script>

<template>
  <div
    role="search"
    aria-label="Поиск и фильтры словаря"
    class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
  >
    <UFormField
      label="Поиск"
      class="sm:col-span-2 lg:col-span-4"
    >
      <UInput
        ref="searchInput"
        v-model="q"
        icon="i-lucide-search"
        placeholder="Слово, источник, аналог…"
        aria-label="Поиск по слову, английскому источнику, аналогу и вариантам написания"
        enterkeyhint="search"
        autocomplete="off"
        size="lg"
        class="w-full"
        :ui="{ trailing: 'pe-1' }"
      >
        <template
          v-if="q.length"
          #trailing
        >
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Очистить поиск"
            @click="clearSearch"
          />
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Группа">
      <USelect
        v-model="groupValue"
        :items="groupItems"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Степень освоения">
      <USelect
        v-model="assimilationValue"
        :items="assimilationItems"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Сфера">
      <USelect
        v-model="sphereValue"
        :items="sphereItems"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Сортировка">
      <USelect
        v-model="sort"
        :items="sortItems"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="flex flex-wrap items-center justify-between gap-2 sm:col-span-2 lg:col-span-4">
      <p
        class="text-sm text-muted"
        aria-live="polite"
        aria-atomic="true"
      >
        Найдено <span class="font-semibold text-highlighted">{{ found }}</span> из {{ total }}
      </p>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-rotate-ccw"
        label="Сбросить"
        :disabled="!canReset"
        @click="onReset"
      />
    </div>
  </div>
</template>
