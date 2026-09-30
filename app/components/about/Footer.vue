<script setup lang="ts">
import { PROJECT_FOOTER_LABEL, PROJECT_TITLE, PROJECT_YEAR } from '~/data/project'
</script>

<template>
  <UFooter :ui="{ root: 'border-t border-default' }">
    <template #left>
      <p class="text-center text-sm text-muted lg:text-start">
        <span class="font-display text-highlighted">
          <span class="text-primary">Баг</span> или <span class="text-secondary">ошибка?</span>
        </span>
        · {{ PROJECT_FOOTER_LABEL }} · {{ PROJECT_YEAR }}
      </p>
    </template>

    <p class="text-center text-sm text-muted">
      {{ PROJECT_TITLE }}
    </p>

    <template #right>
      <!-- Обычная ссылка-якорь: адрес ?q=… словаря сохраняется -->
      <UButton
        to="#top"
        external
        no-rel
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-up"
        label="Наверх"
      />
    </template>
  </UFooter>
</template>
