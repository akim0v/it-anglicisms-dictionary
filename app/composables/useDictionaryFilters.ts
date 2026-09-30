import { watchDebounced } from '@vueuse/core'
import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { Assimilation, Group, Sphere } from '../types/word'
import { ASSIMILATIONS, GROUPS, SPHERES } from '../utils/labels'
import { filterWords, sortWords, useWords, type SortMode } from './useWords'

export const SORT_MODES: SortMode[] = ['alpha', 'group', 'assimilation']
const DEFAULT_SORT: SortMode = 'alpha'
const QUERY_KEYS = ['q', 'group', 'assimilation', 'sphere', 'sort'] as const

function firstString(value: LocationQuery[string] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value
  return typeof v === 'string' ? v : ''
}

function pick<T extends string>(value: string, allowed: readonly T[]): T | null {
  return (allowed as readonly string[]).includes(value) ? (value as T) : null
}

/**
 * Состояние словаря (Ф6–Ф9): поиск, фильтры, сортировка и их синхронизация
 * с адресом `?q=…&group=…`. Адрес читается только после монтирования —
 * страница пререндерится, и на сервере параметров запроса нет.
 */
export function useDictionaryFilters() {
  const route = useRoute()
  const router = useRouter()
  const { words, stats } = useWords()

  const q = ref('')
  const group = ref<Group | null>(null)
  const assimilation = ref<Assimilation | null>(null)
  const sphere = ref<Sphere | null>(null)
  const sort = ref<SortMode>(DEFAULT_SORT)

  const ready = ref(false)
  let lastSynced = ''

  const results = computed(() =>
    sortWords(
      filterWords(words, { q: q.value, group: group.value, assimilation: assimilation.value, sphere: sphere.value }),
      sort.value
    )
  )

  const isFiltered = computed(() =>
    q.value.trim() !== '' || group.value !== null || assimilation.value !== null || sphere.value !== null
  )
  const isDefault = computed(() => !isFiltered.value && sort.value === DEFAULT_SORT)

  /** Только наши параметры; значения по умолчанию в адрес не пишутся */
  function stateQuery(): Record<string, string> {
    const result: Record<string, string> = {}
    const text = q.value.trim()
    if (text) result.q = text
    if (group.value) result.group = group.value
    if (assimilation.value) result.assimilation = assimilation.value
    if (sphere.value) result.sphere = sphere.value
    if (sort.value !== DEFAULT_SORT) result.sort = sort.value
    return result
  }

  function ownPart(query: LocationQuery): string {
    return JSON.stringify(QUERY_KEYS.map(key => firstString(query[key])))
  }

  function applyQuery(query: LocationQuery) {
    q.value = firstString(query.q)
    group.value = pick(firstString(query.group), GROUPS)
    assimilation.value = pick(firstString(query.assimilation), ASSIMILATIONS)
    sphere.value = pick(firstString(query.sphere), SPHERES)
    sort.value = pick(firstString(query.sort), SORT_MODES) ?? DEFAULT_SORT
  }

  function syncToUrl() {
    if (!ready.value) return
    const own = stateQuery()
    const next: LocationQueryRaw = { ...own }
    // Чужие параметры адреса сохраняем
    for (const [key, value] of Object.entries(route.query)) {
      if (!(QUERY_KEYS as readonly string[]).includes(key)) next[key] = value
    }
    const serialized = ownPart(own)
    lastSynced = serialized
    if (serialized === ownPart(route.query)) return
    router.replace({ query: next, hash: route.hash })
  }

  function reset() {
    q.value = ''
    group.value = null
    assimilation.value = null
    sphere.value = null
    sort.value = DEFAULT_SORT
    syncToUrl()
  }

  watch([group, assimilation, sphere, sort], syncToUrl)
  watchDebounced(q, syncToUrl, { debounce: 250 })

  // Внешняя смена адреса (например, кнопка «Назад» или новая ссылка)
  watch(() => route.query, (query) => {
    if (!ready.value) return
    const own = ownPart(query)
    if (own === lastSynced) return
    lastSynced = own
    applyQuery(query)
  })

  onMounted(() => {
    applyQuery(route.query)
    lastSynced = ownPart(route.query)
    ready.value = true
    // Невалидные значения из адреса убираем
    syncToUrl()
  })

  return { q, group, assimilation, sphere, sort, results, total: stats.total, isFiltered, isDefault, reset }
}
