export type PluralForms = readonly [one: string, few: string, many: string]

const rules = new Intl.PluralRules('ru')

/** Русская форма слова для числа: pluralRu(2, ['слово', 'слова', 'слов']) → 'слова' */
export function pluralRu(count: number, forms: PluralForms): string {
  const rule = rules.select(count)
  if (rule === 'one') return forms[0]
  if (rule === 'few') return forms[1]
  return forms[2]
}

/** Число вместе со словом: countRu(5, ['слово', 'слова', 'слов']) → '5 слов' */
export function countRu(count: number, forms: PluralForms): string {
  return `${count} ${pluralRu(count, forms)}`
}
