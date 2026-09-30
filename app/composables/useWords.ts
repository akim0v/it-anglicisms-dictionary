import rawWords from '../data/words.json'
import type { Assimilation, FrequencyPair, FrequencySource, Gender, Group, Sphere, Word } from '../types/word'
import { ASSIMILATIONS, GROUPS, SPHERES, type Verdict } from '../utils/labels'

export const words = rawWords as Word[]

export interface WordFilters {
  q: string
  group: Group | null
  assimilation: Assimilation | null
  sphere: Sphere | null
}

export type SortMode = 'alpha' | 'group' | 'assimilation'

export interface PrefixStat {
  prefix: string
  count: number
  words: Word[]
}

export interface HypothesisRow {
  group: Group
  total: number
  withVerbs: number
  share: number // 0..1
}

export interface WordStats {
  total: number
  declinable: number
  withVerbs: number
  byGroup: Record<Group, number>
  byAssimilation: Record<Assimilation, number>
  bySphere: Record<Sphere, number>
  gender: Record<Gender, number>
  indeclinable: Word[]
  withVariants: Word[]
  verbWords: Word[]
  prefixes: PrefixStat[]
  hypothesis: HypothesisRow[]
}

const collator = new Intl.Collator('ru')

/** Нижний регистр, «ё» → «е», без лишних пробелов */
export function normalizeText(value: string): string {
  return value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim()
}

function countBy<K extends string>(list: Word[], keys: K[], pick: (w: Word) => K): Record<K, number> {
  const result = Object.fromEntries(keys.map(k => [k, 0])) as Record<K, number>
  for (const w of list) result[pick(w)]++
  return result
}

export function computeStats(list: Word[]): WordStats {
  const verbWords = list.filter(w => w.verbs !== null)

  const prefixMap = new Map<string, Word[]>()
  for (const w of verbWords) {
    const prefix = w.verbs!.prefix
    prefixMap.set(prefix, [...(prefixMap.get(prefix) ?? []), w])
  }
  const prefixes = [...prefixMap.entries()]
    .map(([prefix, ws]) => ({ prefix, count: ws.length, words: ws }))
    .sort((a, b) => b.count - a.count)

  const hypothesis = GROUPS.map((group) => {
    const inGroup = list.filter(w => w.group === group)
    const withVerbs = inGroup.filter(w => w.verbs !== null).length
    return { group, total: inGroup.length, withVerbs, share: inGroup.length ? withVerbs / inGroup.length : 0 }
  })

  return {
    total: list.length,
    declinable: list.filter(w => w.declinable).length,
    withVerbs: verbWords.length,
    byGroup: countBy(list, GROUPS, w => w.group),
    byAssimilation: countBy(list, ASSIMILATIONS, w => w.assimilation),
    bySphere: countBy(list, SPHERES, w => w.sphere),
    gender: countBy<Gender>(list, ['m', 'f', 'n'], w => w.gender),
    indeclinable: list.filter(w => !w.declinable),
    withVariants: list.filter(w => w.variants.length > 0),
    verbWords,
    prefixes,
    hypothesis
  }
}

/** Доля англицизма 0..1 или null, если данных нет */
export function getShare(pair: FrequencyPair): number | null {
  const { anglicism, analog } = pair
  if (anglicism === null || analog === null) return null
  const sum = anglicism + analog
  return sum > 0 ? anglicism / sum : null
}

/** Ф3: 60% и выше — англицизм, 40% и ниже — аналог, иначе паритет */
export function getVerdict(share: number): Verdict {
  if (share >= 0.6) return 'anglicism'
  if (share <= 0.4) return 'analog'
  return 'parity'
}

export function hasFrequencyData(list: Word[], source: FrequencySource): boolean {
  return list.some(w => getShare(w.frequency[source]) !== null)
}

export function matchesQuery(w: Word, query: string): boolean {
  const q = normalizeText(query)
  if (!q) return true
  return [w.word, w.source, w.analog, ...w.variants].some(field => normalizeText(field).includes(q))
}

export function filterWords(list: Word[], filters: WordFilters): Word[] {
  return list.filter(w =>
    matchesQuery(w, filters.q)
    && (!filters.group || w.group === filters.group)
    && (!filters.assimilation || w.assimilation === filters.assimilation)
    && (!filters.sphere || w.sphere === filters.sphere)
  )
}

export function sortWords(list: Word[], mode: SortMode): Word[] {
  const alpha = (a: Word, b: Word) => collator.compare(a.word, b.word)
  const compare: Record<SortMode, (a: Word, b: Word) => number> = {
    alpha,
    group: (a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || alpha(a, b),
    assimilation: (a, b) => ASSIMILATIONS.indexOf(a.assimilation) - ASSIMILATIONS.indexOf(b.assimilation) || alpha(a, b)
  }
  return [...list].sort(compare[mode])
}

const stats = computeStats(words)
const wordsById = new Map(words.map(w => [w.id, w]))

export function useWords() {
  return {
    words,
    stats,
    getWord: (id: string) => wordsById.get(id),
    hasFrequencyData: (source: FrequencySource) => hasFrequencyData(words, source)
  }
}
