<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="flex flex-col gap-1.5">
    <h3 class="font-sans text-xs font-semibold tracking-wide text-muted uppercase">
      {{ title }}
    </h3>
    <div class="text-sm text-default">
      <slot />
    </div>
  </section>
</template>
