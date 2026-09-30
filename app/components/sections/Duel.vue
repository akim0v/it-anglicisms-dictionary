<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { FrequencySource, Group } from '~/types/word'

type GroupTab = Group | 'all'

const { words, stats, hasFrequencyData } = useWords()

// Ф5: вкладки «Все / А / Б / В» со счётчиком слов
const group = ref<GroupTab>('all')
const groupTabs = computed<TabsItem[]>(() => [
  { label: 'Все', value: 'all', badge: counter(stats.total) },
  ...GROUPS.map(g => ({ label: groupLetters[g], value: g, badge: counter(stats.byGroup[g]) }))
])

// Мягкий нейтральный бейдж читается и на активной (синей) вкладке
function counter(n: number) {
  return { label: n, color: 'neutral' as const, variant: 'soft' as const }
}

// Ф2: переключатель источника виден, только если есть данные хотя бы по одному
const availableSources = FREQUENCY_SOURCES.filter(s => hasFrequencyData(s))
const source = ref<FrequencySource | null>(availableSources[0] ?? null)
const sourceTabs = computed<TabsItem[]>(() =>
  FREQUENCY_SOURCES.map(s => ({
    label: frequencySourceLabels[s],
    value: s,
    disabled: !availableSources.includes(s)
  }))
)

const pairs = computed(() =>
  group.value === 'all'
    ? sortWords(words, 'group')
    : sortWords(words.filter(w => w.group === group.value), 'alpha')
)

function onGroupChange(value: string | number) {
  group.value = value as GroupTab
}
function onSourceChange(value: string | number) {
  source.value = value as FrequencySource
}

/*
 * Единственная анимация страницы: полосы заполняются при первом появлении
 * списка на экране. В пререндере и при prefers-reduced-motion полосы сразу
 * в конечном состоянии, поэтому гидратация совпадает с HTML.
 */
const listRef = useTemplateRef<HTMLElement>('list')
const revealed = ref(true)
const animated = ref(false)
let observer: IntersectionObserver | null = null
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const el = listRef.value
  if (!el || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = el.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) return

  // Список ещё за пределами экрана: мгновенно (без перехода) обнуляем полосы
  revealed.value = false
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return
    observer?.disconnect()
    observer = null
    // Сначала включаем переход, в следующем кадре — заполняем
    animated.value = true
    requestAnimationFrame(() => {
      revealed.value = true
    })
    // После заполнения переключения вкладок и источника — без анимации
    timer = setTimeout(() => {
      animated.value = false
    }, 1200)
    // Список длинный: реагируем на появление его верхнего края, а не на долю площади
  }, { rootMargin: '0px 0px -15% 0px' })
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
})
</script>

<template>
  <UPageSection
    id="duel"
    headline="Англицизм против аналога"
    title="Дуэль"
    :ui="{ container: 'py-12 sm:py-16 lg:py-24 gap-8 sm:gap-10' }"
  >
    <template #description>
      Кто чаще встречается в текстах — англицизм или его русский аналог.
      Полоса показывает долю англицизма: <span class="font-semibold text-primary">синяя часть</span> — англицизм,
      <span class="font-semibold text-secondary">малиновая</span> — аналог. Нажмите на пару, чтобы открыть статью.
    </template>

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Группа по типу аналога"
          class="w-full sm:w-auto"
        >
          <UTabs
            :model-value="group"
            :items="groupTabs"
            :content="false"
            :ui="{ trigger: 'px-3 sm:px-4' }"
            @update:model-value="onGroupChange"
          />
        </div>
        <div
          v-if="source"
          role="group"
          aria-labelledby="duel-source-label"
          class="flex items-center gap-2"
        >
          <span
            id="duel-source-label"
            class="text-sm text-muted"
          >Источник:</span>
          <UTabs
            :model-value="source"
            :items="sourceTabs"
            :content="false"
            color="neutral"
            size="sm"
            @update:model-value="onSourceChange"
          />
        </div>
      </div>

      <DuelForecast
        :group="group"
        :pending="!source"
      />

      <ul
        ref="list"
        class="flex flex-col gap-1"
        :aria-label="`Пары «англицизм — аналог»: ${pairs.length}`"
      >
        <DuelRow
          v-for="w in pairs"
          :key="w.id"
          :word="w"
          :source="source"
          :revealed="revealed"
          :animated="animated"
          :show-group="group === 'all'"
        />
      </ul>
    </div>
  </UPageSection>
</template>
