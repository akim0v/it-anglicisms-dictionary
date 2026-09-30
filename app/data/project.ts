/**
 * Сведения о проекте для секции «О проекте» (Ф18) и подвала.
 * Адрес сайта не дублируется: он берётся из runtimeConfig.public.siteUrl (nuxt.config.ts).
 */

export const PROJECT_TITLE = 'Англицизмы в речи IT-специалистов'
export const PROJECT_FOOTER_LABEL = 'Проект по русскому языку'
export const PROJECT_YEAR = 2026

export const AUTHORS: string[] = [
  'Децев Тимофей',
  'Мурадян Земфира',
  'Саввин Аким'
]

export const PROJECT_GOAL
  = 'Выяснить, какие англицизмы из речи IT-специалистов вытесняют русские аналоги, а какие уступают им, '
    + 'и насколько глубоко заимствования вошли в русскую грамматику: получили ли род, склонение и видовые пары глаголов.'

export type ProjectMethodId = 'sample' | 'groups' | 'etymology' | 'grammar' | 'frequency'

export interface ProjectMethod {
  id: ProjectMethodId
  title: string
  description: string
  icon: string
}

export const PROJECT_METHODS: ProjectMethod[] = [
  {
    id: 'sample',
    title: 'Сплошная выборка',
    description: 'Из профессиональной речи разработчиков отобраны IT-англицизмы, у которых есть русский аналог.',
    icon: 'i-lucide-list-checks'
  },
  {
    id: 'groups',
    title: 'Классификация по типу аналога',
    description: 'Слова разделены на группы А, Б и В: аналог описательный, общеупотребительный или терминологический.',
    icon: 'i-lucide-layers'
  },
  {
    id: 'etymology',
    title: 'Этимологический анализ',
    description: 'Происхождение английских слов-источников сверялось с Online Etymology Dictionary.',
    icon: 'i-lucide-book-open'
  },
  {
    id: 'grammar',
    title: 'Анализ грамматической адаптации',
    description: 'Для каждого слова определены род, склоняемость и наличие глаголов с видовыми парами.',
    icon: 'i-lucide-spell-check'
  },
  {
    id: 'frequency',
    title: 'Частотный анализ',
    description: 'Употребительность англицизма и аналога сравнивается по Национальному корпусу русского языка и Хабру.',
    icon: 'i-lucide-chart-no-axes-column'
  }
]

export interface ProjectSource {
  title: string
  description: string
  /** null — печатный источник без ссылки */
  url: string | null
}

export const PROJECT_SOURCES: ProjectSource[] = [
  {
    title: 'Online Etymology Dictionary',
    description: 'Этимология английских слов-источников',
    url: 'https://www.etymonline.com'
  },
  {
    title: 'Национальный корпус русского языка',
    description: 'Частотность англицизмов и русских аналогов',
    url: 'https://ruscorpora.ru'
  },
  {
    title: 'Хабр',
    description: 'Живое употребление в статьях и комментариях IT-специалистов',
    url: 'https://habr.com'
  },
  {
    title: 'Л. П. Крысин. Толковый словарь иноязычных слов',
    description: 'Значения и степень освоения заимствований',
    url: null
  }
]
