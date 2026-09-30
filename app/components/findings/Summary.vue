<script setup lang="ts">
import type { Group } from '~/types/word'

type Part = string | { label: string, href: string }

interface Finding {
  id: string
  title: string
  icon: string
  parts: Part[]
}

const { stats, hasFrequencyData } = useWords()

const pluralRules = new Intl.PluralRules('ru')
function plural(n: number, one: string, few: string, many: string): string {
  const form = pluralRules.select(n)
  return `${n} ${form === 'one' ? one : form === 'few' ? few : many}`
}
const listFormat = new Intl.ListFormat('ru', { type: 'conjunction' })
const percent = (share: number) => `${Math.round(share * 100)}%`
const groupName = (group: Group) => `${groupLetters[group]} (${groupLabels[group].toLowerCase()})`
const duelLink = { label: '«Дуэль»', href: '#duel' }

function grammarFinding(): Finding {
  const { total, declinable, indeclinable, gender } = stats
  const others = (['f', 'n'] as const)
    .filter(g => gender[g] > 0)
    .map(g => `, ${gender[g]} — ${genderLabels[g].replace(' род', '')}`)
    .join('')
  const exceptions = indeclinable.length
    ? ` ${indeclinable.length === 1 ? 'Несклоняемым остаётся' : 'Несклоняемыми остаются'} только`
    + ` ${listFormat.format(indeclinable.map(w => `«${w.word}»`))}.`
    : ''
  return {
    id: 'grammar',
    title: 'Англицизмы получают русскую грамматику',
    icon: 'i-lucide-spell-check',
    parts: [
      `${declinable} из ${plural(total, 'слова', 'слов', 'слов')}`
      + ` ${pluralRules.select(declinable) === 'one' ? 'склоняется' : 'склоняются'} как русские существительные.`
      + ` ${plural(gender.m, 'слово получило', 'слова получили', 'слов получили')} ${genderLabels.m}${others}.`
      + exceptions
    ]
  }
}

function verbsFinding(): Finding | null {
  const { withVerbs, verbWords, prefixes } = stats
  const example = verbWords[0]?.verbs
  const top = prefixes[0]
  if (!example || !top) return null
  return {
    id: 'verbs',
    title: 'Видовые пары строятся по русским моделям',
    icon: 'i-lucide-arrow-right-left',
    parts: [
      `${plural(withVerbs, 'англицизм образует', 'англицизма образуют', 'англицизмов образуют')} русские глаголы`
      + ` с видовыми парами (${example.imperfective} → ${example.perfective}).`
      + ` Совершенный вид чаще всего образуется приставкой ${top.prefix}: ${top.count} из ${withVerbs}.`
    ]
  }
}

function hypothesisFinding(): Finding | null {
  const sorted = [...stats.hypothesis].filter(r => r.total > 0).sort((a, b) => b.share - a.share)
  const top = sorted[0]
  const bottom = sorted.at(-1)
  if (!top || !bottom || top.share === bottom.share) return null
  const facts = `Доля слов с глаголами выше всего в группе ${groupName(top.group)} — ${percent(top.share)},`
    + ` ниже всего в группе ${groupName(bottom.group)} — ${percent(bottom.share)}.`
  const confirmed = top.group === 'V' && bottom.group === 'A'
  const examples = stats.verbWords
    .filter(w => w.group === top.group)
    .slice(0, 2)
    .map(w => w.verbs?.perfective)
    .filter(Boolean)
    .join(', ')
  const explanation = confirmed
    ? ' Чем терминологичнее русский аналог, тем глубже англицизм входит в грамматику:'
    + ` когда англицизму противостоит книжный термин, от самого англицизма охотно образуют глаголы${examples ? ` (${examples})` : ''};`
    + ' при описательном аналоге это происходит реже всего.'
    : ' Порядок групп отличается от ожидаемого, поэтому гипотеза требует уточнения.'
  return {
    id: 'hypothesis',
    title: confirmed ? 'Гипотеза подтверждается грамматикой' : 'Гипотеза требует уточнения',
    icon: 'i-lucide-flask-conical',
    parts: [facts + explanation]
  }
}

function assimilationFinding(): Finding {
  const { byAssimilation, total } = stats
  const list = ASSIMILATIONS.map(a => `${assimilationPluralLabels[a].toLowerCase()} — ${byAssimilation[a]}`).join(', ')
  const leader = [...ASSIMILATIONS].sort((a, b) => byAssimilation[b] - byAssimilation[a])[0]
  const note = leader === 'professional'
    ? byAssimilation.professional * 2 > total
      ? ' Большинство слов пока остаются профессионализмами — они живут в речи IT-специалистов.'
      : ' Чаще всего встречаются профессионализмы — слова речи IT-специалистов.'
    : ''
  return {
    id: 'assimilation',
    title: 'Степень освоения',
    icon: 'i-lucide-gauge',
    parts: [`По степени освоения: ${list}.${note}`]
  }
}

function frequencyFinding(): Finding {
  const ready = FREQUENCY_SOURCES.filter(source => hasFrequencyData(source))
  if (ready.length) {
    const labels = listFormat.format(ready.map(source => frequencySourceLabels[source]))
    return {
      id: 'frequency',
      title: 'Частотная конкуренция',
      icon: 'i-lucide-swords',
      parts: [`Частотные данные внесены (${labels}): кто побеждает в каждой паре, показано в разделе `, duelLink, '.']
    }
  }
  const sources = listFormat.format(FREQUENCY_SOURCES.map(source => frequencySourceLabels[source]))
  return {
    id: 'frequency',
    title: 'Частотная конкуренция ещё проверяется',
    icon: 'i-lucide-swords',
    parts: [
      `Частоты употребления пока собираются (${sources}), поэтому выводов о том, кто побеждает, мы не делаем. В разделе `,
      duelLink,
      ' сейчас показаны прогнозы для каждой группы.'
    ]
  }
}

const findings = [
  grammarFinding(),
  verbsFinding(),
  hypothesisFinding(),
  assimilationFinding(),
  frequencyFinding()
].filter((f): f is Finding => f !== null)
</script>

<template>
  <ol class="grid gap-4 sm:grid-cols-2">
    <li
      v-for="finding in findings"
      :key="finding.id"
      class="flex gap-4 rounded-lg border p-4 sm:p-5"
      :class="finding.id === 'hypothesis' ? 'border-primary/40 bg-primary/5 sm:col-span-2' : 'border-default bg-default'"
    >
      <span
        class="grid size-10 shrink-0 place-items-center rounded-md bg-elevated text-primary"
        aria-hidden="true"
      >
        <UIcon
          :name="finding.icon"
          class="size-5"
        />
      </span>
      <div class="min-w-0">
        <h4 class="font-semibold text-highlighted">
          {{ finding.title }}
        </h4>
        <p class="mt-2 text-sm leading-relaxed text-default sm:text-base">
          <template
            v-for="(part, i) in finding.parts"
            :key="i"
          >
            <span v-if="typeof part === 'string'">{{ part }}</span>
            <a
              v-else
              :href="part.href"
              class="font-semibold text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-primary rounded-sm"
            >{{ part.label }}</a>
          </template>
        </p>
      </div>
    </li>
  </ol>
</template>
