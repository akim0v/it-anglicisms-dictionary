<script setup lang="ts">
const { stats } = useWords()

// Тот же формат «53%», что в дуэли и выводах; без Intl, чтобы SSR и браузер дали один и тот же текст
const percent = (share: number) => `${Math.round(share * 100)}%`
const maxCount = Math.max(1, ...stats.prefixes.map(p => p.count))

const items = stats.prefixes.map(({ prefix, count }) => ({
  prefix,
  count,
  share: percent(stats.withVerbs ? count / stats.withVerbs : 0),
  width: `${(count / maxCount) * 100}%`
}))

const leader = items[0]
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <h3 class="text-base">
        Приставки совершенного вида
      </h3>
      <p class="mt-1 text-sm text-muted">
        <template v-if="leader">
          Чаще всего — <span class="font-semibold text-secondary">{{ leader.prefix }}</span>:
          {{ countRu(leader.count, ['глагол', 'глагола', 'глаголов']) }} из {{ stats.withVerbs }} ({{ leader.share }}).
        </template>
        Доли считаются от всех глаголов.
      </p>
    </template>

    <ul class="space-y-4">
      <li
        v-for="item in items"
        :key="item.prefix"
      >
        <div class="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          <span class="font-display text-base text-secondary">{{ item.prefix }}</span>
          <span class="text-muted">
            <span class="font-semibold text-highlighted">{{ item.count }}</span><span class="sr-only">
              {{ pluralRu(item.count, ['глагол', 'глагола', 'глаголов']) }},</span>
            <span aria-hidden="true">·</span> {{ item.share }}
          </span>
        </div>
        <div
          class="h-2 overflow-hidden rounded-full bg-elevated"
          aria-hidden="true"
        >
          <div
            class="h-full rounded-full bg-secondary"
            :style="{ width: item.width }"
          />
        </div>
      </li>
    </ul>
  </UCard>
</template>
