import { describe, expect, it } from 'vitest'
import type { Word } from '../app/types/word'
import {
  computeStats,
  filterWords,
  getShare,
  getVerdict,
  hasFrequencyData,
  normalizeText,
  sortWords,
  words
} from '../app/composables/useWords'

const byWord = (list: Word[]) => list.map(w => w.word)

describe('данные words.json', () => {
  it('содержит 36 слов с уникальными id', () => {
    expect(words).toHaveLength(36)
    expect(new Set(words.map(w => w.id)).size).toBe(36)
  })
})

describe('computeStats', () => {
  const stats = computeStats(words)

  it('Ф1: 36 слов, 34 склоняются, 15 видовых пар', () => {
    expect(stats.total).toBe(36)
    expect(stats.declinable).toBe(34)
    expect(stats.withVerbs).toBe(15)
  })

  it('группы 14 / 10 / 12', () => {
    expect(stats.byGroup).toEqual({ A: 14, B: 10, V: 12 })
  })

  it('степень освоения 8 / 25 / 3', () => {
    expect(stats.byAssimilation).toEqual({ full: 8, professional: 25, partial: 3 })
  })

  it('Ф14: распределение приставок за- 8, от- 3, с- 2, по- 1, про- 1', () => {
    expect(stats.prefixes.map(p => [p.prefix, p.count])).toEqual([
      ['за-', 8],
      ['от-', 3],
      ['с-', 2],
      ['по-', 1],
      ['про-', 1]
    ])
    expect(stats.prefixes.reduce((sum, p) => sum + p.words.length, 0)).toBe(15)
  })

  it('Ф15: 32 мужского рода, 2 женского, 2 несклоняемых, 7 слов с вариантами', () => {
    expect(stats.gender).toEqual({ m: 32, f: 2, n: 2 })
    expect(byWord(stats.indeclinable).sort()).toEqual(['легаси', 'ревью'])
    expect(stats.withVariants).toHaveLength(7)
  })

  it('Ф17: доли слов с глаголами 21% / 50% / 58%', () => {
    expect(stats.hypothesis.map(h => [h.group, h.total, h.withVerbs, Math.round(h.share * 100)])).toEqual([
      ['A', 14, 3, 21],
      ['B', 10, 5, 50],
      ['V', 12, 7, 58]
    ])
  })
})

describe('частоты и вердикты (Ф2–Ф4)', () => {
  it('нет данных — null', () => {
    expect(getShare({ anglicism: null, analog: null })).toBeNull()
    expect(getShare({ anglicism: 5, analog: null })).toBeNull()
    expect(getShare({ anglicism: 0, analog: 0 })).toBeNull()
  })

  it('доля англицизма', () => {
    expect(getShare({ anglicism: 80, analog: 20 })).toBeCloseTo(0.8)
  })

  it('пороги вердикта 60% / 40%', () => {
    expect(getVerdict(0.6)).toBe('anglicism')
    expect(getVerdict(0.59)).toBe('parity')
    expect(getVerdict(0.41)).toBe('parity')
    expect(getVerdict(0.4)).toBe('analog')
  })

  it('сейчас частот нет ни в одном источнике', () => {
    expect(hasFrequencyData(words, 'ruscorpora')).toBe(false)
    expect(hasFrequencyData(words, 'habr')).toBe(false)
  })

  it('данные появляются, если вписать частоты хотя бы для одной пары', () => {
    const patched = words.map(w => w.id === 'commit'
      ? { ...w, frequency: { ...w.frequency, habr: { anglicism: 80, analog: 20 } } }
      : w)
    expect(hasFrequencyData(patched, 'habr')).toBe(true)
    expect(hasFrequencyData(patched, 'ruscorpora')).toBe(false)
  })
})

describe('поиск, фильтры, сортировка (Ф6–Ф8)', () => {
  const empty = { q: '', group: null, assimilation: null, sphere: null }

  it('ё приравнивается к е, регистр не важен', () => {
    expect(normalizeText('Развёртывание')).toBe('развертывание')
  })

  it('находит по варианту написания: «мердж» → мерж', () => {
    expect(byWord(filterWords(words, { ...empty, q: 'мердж' }))).toEqual(['мерж'])
  })

  it('находит по аналогу: «отладка» → дебаг', () => {
    expect(byWord(filterWords(words, { ...empty, q: 'отладка' }))).toEqual(['дебаг'])
  })

  it('«развертывание» и «развёртывание» дают одинаковый результат', () => {
    const a = filterWords(words, { ...empty, q: 'развертывание' })
    const b = filterWords(words, { ...empty, q: 'РАЗВЁРТЫВАНИЕ' })
    expect(byWord(a)).toEqual(['деплой'])
    expect(byWord(b)).toEqual(byWord(a))
  })

  it('находит по английскому источнику', () => {
    expect(byWord(filterWords(words, { ...empty, q: 'Commit' }))).toEqual(['коммит'])
  })

  it('фильтры по группе, освоению и сфере', () => {
    expect(filterWords(words, { ...empty, group: 'V' })).toHaveLength(12)
    expect(filterWords(words, { ...empty, assimilation: 'partial' })).toHaveLength(3)
    expect(filterWords(words, { ...empty, group: 'A', sphere: 'process' }).length).toBeGreaterThan(0)
  })

  it('сортировка по алфавиту в русской локали', () => {
    const sorted = byWord(sortWords(words, 'alpha'))
    expect(sorted[0]).toBe('апдейт')
    expect(sorted.at(-1)).toBe('юзер')
  })

  it('сортировка по группе и по степени освоения', () => {
    expect(sortWords(words, 'group').map(w => w.group).join('')).toMatch(/^A+B+V+$/)
    expect(sortWords(words, 'assimilation').map(w => w.assimilation[0]).join('')).toMatch(/^f+p+$/)
    expect(sortWords(words, 'assimilation').at(-1)?.assimilation).toBe('partial')
  })
})
