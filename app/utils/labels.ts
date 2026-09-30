import type { Assimilation, FrequencySource, Gender, Group, Sphere } from '../types/word'

export const GROUPS: Group[] = ['A', 'B', 'V']
export const SPHERES: Sphere[] = ['dev', 'process', 'general']
export const ASSIMILATIONS: Assimilation[] = ['full', 'professional', 'partial']
export const FREQUENCY_SOURCES: FrequencySource[] = ['ruscorpora', 'habr']

/** Буква группы по-русски: А, Б, В */
export const groupLetters: Record<Group, string> = {
  A: 'А',
  B: 'Б',
  V: 'В'
}

export const groupLabels: Record<Group, string> = {
  A: 'Описательный аналог',
  B: 'Общеупотребительный аналог',
  V: 'Терминологический аналог'
}

/** Прогноз гипотезы для группы (Ф4) */
export const groupForecasts: Record<Group, string> = {
  A: 'Побеждает англицизм',
  B: 'Побеждает аналог или паритет',
  V: 'В статьях — аналог, в комментариях — англицизм'
}

export const sphereLabels: Record<Sphere, string> = {
  dev: 'Разработка',
  process: 'Командные процессы',
  general: 'Общее'
}

export const assimilationLabels: Record<Assimilation, string> = {
  full: 'Освоенное',
  professional: 'Профессионализм',
  partial: 'Частично освоенное'
}

/** Подписи для колонок секции «Степень освоения» (множественное число) */
export const assimilationPluralLabels: Record<Assimilation, string> = {
  full: 'Освоенные',
  professional: 'Профессионализмы',
  partial: 'Частично освоенные'
}

export const genderLabels: Record<Gender, string> = {
  m: 'мужской род',
  f: 'женский род',
  n: 'средний род'
}

export const frequencySourceLabels: Record<FrequencySource, string> = {
  ruscorpora: 'НКРЯ',
  habr: 'Хабр'
}

export type Verdict = 'anglicism' | 'analog' | 'parity'

export const verdictLabels: Record<Verdict, string> = {
  anglicism: 'Побеждает англицизм',
  analog: 'Побеждает аналог',
  parity: 'Паритет'
}

export const NO_DATA_LABEL = 'Данные собираются'
