export type Group = 'A' | 'B' | 'V' // А — описательный аналог, Б — общеупотребительный, В — терминологический
export type Sphere = 'dev' | 'process' | 'general'
export type Assimilation = 'full' | 'professional' | 'partial'
export type Gender = 'm' | 'f' | 'n'
export type FrequencySource = 'ruscorpora' | 'habr'

export interface FrequencyPair {
  anglicism: number | null // ipm или число вхождений; null — данных ещё нет
  analog: number | null
}

export interface VerbPair {
  imperfective: string
  perfective: string
  prefix: string
}

export interface Word {
  id: string // латиницей, для якорей: 'commit'
  word: string // 'коммит'
  source: string // 'commit'
  meaning: string
  etymology: string
  etymologyVerified: boolean // сверено с Online Etymology Dictionary
  analog: string // 'фиксация'
  group: Group
  sphere: Sphere
  assimilation: Assimilation
  gender: Gender
  declinable: boolean
  verbs: VerbPair | null
  derivatives: string[] // 'релизный', 'бэкендер', 'легаси-код'
  variants: string[] // другие написания: 'мердж'
  frequency: Record<FrequencySource, FrequencyPair>
}
