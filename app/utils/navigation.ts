/** Секции страницы: якорь и подпись для навигации в шапке */
export const SECTIONS = [
  { id: 'duel', label: 'Дуэль' },
  { id: 'dictionary', label: 'Словарь' },
  { id: 'grammar', label: 'Грамматика' },
  { id: 'assimilation', label: 'Освоение' },
  { id: 'findings', label: 'Выводы' },
  { id: 'about', label: 'О проекте' }
] as const

export type SectionId = typeof SECTIONS[number]['id'] | 'top'
