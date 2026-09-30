<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { useMounted } from '@vueuse/core'

const { stats } = useWords()
const route = useRoute()
const mounted = useMounted()

/** Русское множественное число: [одно, два–четыре, пять и больше] */
function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

// Ф1: все три цифры считаются из words.json
const figures = computed(() => [
  {
    key: 'total',
    value: stats.total,
    label: `${plural(stats.total, ['слово', 'слова', 'слов'])} в словаре`
  },
  {
    key: 'declinable',
    value: stats.declinable,
    label: plural(stats.declinable, ['склоняется', 'склоняются', 'склоняются'])
  },
  {
    key: 'verbs',
    value: stats.withVerbs,
    label: `${plural(stats.withVerbs, ['видовая пара', 'видовые пары', 'видовых пар'])} глаголов`
  }
])

// Сохраняем ?q=…&group=… словаря; до гидратации — без query, чтобы HTML совпал с пререндером
function sectionLink(hash: string) {
  return { query: mounted.value ? route.query : {}, hash }
}

const links = computed<ButtonProps[]>(() => [
  {
    label: 'Открыть словарь',
    to: sectionLink('#dictionary'),
    icon: 'i-lucide-book-open'
  },
  {
    label: 'Как мы исследовали',
    to: sectionLink('#about'),
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-down'
  }
])
</script>

<template>
  <UPageHero
    id="top"
    as="section"
    headline="Англицизмы в речи IT-специалистов"
    :links="links"
    :ui="{
      container: 'py-16 sm:py-24 lg:py-32 gap-10 sm:gap-y-16',
      title: 'text-4xl sm:text-6xl lg:text-7xl',
      headline: 'text-sm sm:text-base',
      body: 'mt-8'
    }"
  >
    <template #title>
      <span class="text-primary">Баг</span>
      {{ ' ' }}<span class="text-muted">или</span>
      {{ ' ' }}<span class="text-secondary">ошибка?</span>
    </template>

    <template #description>
      Интерактивный словарь IT-англицизмов: что слово значит, откуда пришло,
      какие русские формы у него появились и как оно конкурирует с русским аналогом.
    </template>

    <template #body>
      <p class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm sm:text-base text-toned">
        <span class="inline-flex items-center gap-2">
          <span
            class="size-3 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span><span class="font-semibold text-primary">синий</span> — англицизм</span>
        </span>
        <span class="inline-flex items-center gap-2">
          <span
            class="size-3 rounded-full bg-secondary"
            aria-hidden="true"
          />
          <span><span class="font-semibold text-secondary">малиновый</span> — русский аналог</span>
        </span>
      </p>

      <dl class="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
        <div
          v-for="figure in figures"
          :key="figure.key"
          class="flex flex-col-reverse items-center gap-1 rounded-lg bg-elevated/60 px-2 py-4 ring ring-default sm:px-4 sm:py-6"
        >
          <dt class="text-xs text-muted text-balance sm:text-sm">
            {{ figure.label }}
          </dt>
          <dd class="font-display text-3xl font-bold text-highlighted sm:text-5xl">
            {{ figure.value }}
          </dd>
        </div>
      </dl>
    </template>
  </UPageHero>
</template>
