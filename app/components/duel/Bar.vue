<script setup lang="ts">
/**
 * Двусторонняя полоса дуэли (Ф2, Ф4): слева синяя доля англицизма,
 * справа малиновая доля аналога; без данных — нейтральная пунктирная полоса.
 */
const props = defineProps<{
  anglicism: string
  analog: string
  /** Доля англицизма 0..1 или null, если данных нет */
  share: number | null
  /** false — полоса ещё не заполнена (ждёт появления секции на экране) */
  revealed: boolean
  /** Включить плавное заполнение (единственная анимация страницы) */
  animated: boolean
}>()

const percent = computed(() => (props.share === null ? null : Math.round(props.share * 100)))

const ariaLabel = computed(() =>
  percent.value === null
    ? `${props.anglicism} — ${props.analog}: ${NO_DATA_LABEL.toLocaleLowerCase('ru')}`
    : `${props.anglicism} ${percent.value}%, ${props.analog} ${100 - percent.value}%`
)

const widths = computed(() => {
  if (percent.value === null || !props.revealed) return { anglicism: '0%', analog: '0%' }
  return { anglicism: `${percent.value}%`, analog: `${100 - percent.value}%` }
})

const segmentClass = computed(() => [
  'h-full',
  props.animated ? 'transition-[width] duration-1000 ease-out motion-reduce:transition-none' : ''
])
</script>

<template>
  <div
    role="img"
    :aria-label="ariaLabel"
    class="relative h-3 w-full overflow-hidden rounded-full sm:h-4"
    :class="share === null ? 'border border-dashed border-accented bg-elevated' : 'bg-accented'"
  >
    <template v-if="share !== null">
      <div class="flex size-full justify-between">
        <div
          :class="segmentClass"
          class="bg-primary"
          :style="{ width: widths.anglicism }"
        />
        <div
          :class="segmentClass"
          class="bg-secondary"
          :style="{ width: widths.analog }"
        />
      </div>
      <!-- Отметка паритета 50% (в нейтральном состоянии без данных не нужна) -->
      <div
        class="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-default/80"
        aria-hidden="true"
      />
    </template>
  </div>
</template>
